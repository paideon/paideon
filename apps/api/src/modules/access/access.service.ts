import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import type { Prisma } from '@paideon/database/generated/client/client';
import {
  CAPABILITY_CATALOG,
  CAPABILITY_VALUES,
  CapabilityEnum,
  CapabilityScopeSchema,
  LEGACY_KIND_ROLE_KEY,
  SYSTEM_ROLES,
  holdsCapability,
  resolveCapabilities,
  type AccessRoleData,
  type AssignRoleData,
  type CapabilityEnumData,
  type CapabilityGrantData,
  type CapabilityInfoData,
  type CreateGrantData,
  type CreateRoleData,
  type MemberAccessData,
  type RoleHeld,
  type UpdateRoleData,
} from '@paideon/contracts';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';

type Actor = Pick<JwtPayload, 'sub' | 'schoolId' | 'role' | 'paideonId'>;
type RequestContext = { ipAddress?: string; userAgent?: string };

const SUPER_ADMIN_KEY = 'super-admin';
// A change to a role or grant reaches a signed-in person within this time at
// most. Changes made through this service clear the cache at once.
const CACHE_MS = 15_000;

const roleSelect = {
  id: true,
  key: true,
  name: true,
  description: true,
  isSystem: true,
  locked: true,
  capabilities: { select: { capability: true } },
  _count: { select: { members: true } },
} satisfies Prisma.AccessRoleSelect;

type RoleRow = Prisma.AccessRoleGetPayload<{ select: typeof roleSelect }>;

/** Keep only capability names the code still knows. */
function known(rows: readonly { capability: string }[]): CapabilityEnumData[] {
  return rows.flatMap((row) => {
    const parsed = CapabilityEnum.safeParse(row.capability);
    return parsed.success ? [parsed.data] : [];
  });
}

// Who may do what. Roles and grants live in the database; the capability
// NAMES live in code (packages/contracts). Nothing here checks a role name
// except to protect the super admin.
@Injectable()
export class AccessService implements OnModuleInit {
  private readonly logger = new Logger(AccessService.name);
  private readonly cache = new Map<
    string,
    { until: number; grants: CapabilityGrantData[] }
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ───────────────────────── start-up ─────────────────────────

  /** Make sure every school has the system roles. Safe to run on every start. */
  async onModuleInit() {
    try {
      const schools = await this.prisma.school.findMany({
        select: { id: true },
      });
      for (const school of schools) await this.ensureSystemRoles(school.id);
    } catch (error) {
      // Do not stop the API: an unmigrated database should say so loudly,
      // and every capability check will then refuse, which is the safe side.
      this.logger.error('Could not set up the system roles', error);
    }
  }

  /**
   * Creates a missing system role with its starting capabilities. Later edits
   * are never overwritten, except the locked super admin, which always holds
   * every capability the code defines.
   */
  async ensureSystemRoles(schoolId: string) {
    for (const definition of SYSTEM_ROLES) {
      const existing = await this.prisma.accessRole.findUnique({
        where: { schoolId_key: { schoolId, key: definition.key } },
        select: { id: true, locked: true },
      });

      if (!existing) {
        const created = await this.prisma.accessRole.create({
          data: {
            schoolId,
            key: definition.key,
            name: definition.name,
            description: definition.description,
            isSystem: true,
            locked: definition.locked,
            defaultForKinds: [...definition.defaultForKinds],
            capabilities: {
              create: definition.capabilities.map((capability) => ({
                capability,
              })),
            },
          },
          select: { id: true },
        });
        await this.backfillLegacyKind(schoolId, definition.key, created.id);
      } else if (existing.locked) {
        await this.syncLockedRole(existing.id);
      }
    }
    this.cache.clear();
  }

  // People created before roles existed keep their access: librarians get the
  // librarian role and admins the super admin role, once, when the role is
  // first created.
  private async backfillLegacyKind(
    schoolId: string,
    roleKey: string,
    roleId: string,
  ) {
    for (const [kind, key] of Object.entries(LEGACY_KIND_ROLE_KEY)) {
      if (key !== roleKey) continue;
      const users = await this.prisma.user.findMany({
        where: { schoolId, role: kind as never, deletedAt: null },
        select: { id: true },
      });
      if (users.length === 0) continue;
      await this.prisma.memberRole.createMany({
        data: users.map((user) => ({
          schoolId,
          userId: user.id,
          roleId,
          scope: 'SCHOOL',
          assignedBy: 'system',
        })),
        skipDuplicates: true,
      });
    }
  }

  private async syncLockedRole(roleId: string) {
    await this.prisma.roleCapability.createMany({
      data: CAPABILITY_VALUES.map((capability) => ({ roleId, capability })),
      skipDuplicates: true,
    });
    await this.prisma.roleCapability.deleteMany({
      where: { roleId, capability: { notIn: [...CAPABILITY_VALUES] } },
    });
  }

  // ───────────────────────── what a person may do ─────────────────────────

  /** Everything this person may do right now: roles, grants, and what those imply. */
  async capabilitiesFor(
    user: Pick<JwtPayload, 'sub' | 'schoolId' | 'role'>,
  ): Promise<CapabilityGrantData[]> {
    const key = `${user.schoolId}:${user.sub}`;
    const cached = this.cache.get(key);
    if (cached && cached.until > Date.now()) return cached.grants;

    const now = new Date();
    const [assigned, automatic, grants] = await Promise.all([
      this.prisma.memberRole.findMany({
        where: { userId: user.sub, schoolId: user.schoolId },
        select: {
          scope: true,
          role: { select: { capabilities: { select: { capability: true } } } },
        },
      }),
      this.prisma.accessRole.findMany({
        where: { schoolId: user.schoolId, defaultForKinds: { has: user.role } },
        select: { capabilities: { select: { capability: true } } },
      }),
      this.prisma.memberGrant.findMany({
        where: {
          userId: user.sub,
          schoolId: user.schoolId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        select: { capability: true, scope: true, expiresAt: true },
      }),
    ]);

    const roles: RoleHeld[] = [];
    for (const row of assigned) {
      const scope = CapabilityScopeSchema.safeParse(row.scope);
      if (scope.success) {
        roles.push({
          capabilities: known(row.role.capabilities),
          scope: scope.data,
        });
      }
    }
    for (const role of automatic) {
      roles.push({ capabilities: known(role.capabilities), scope: 'SCHOOL' });
    }

    const direct = grants.flatMap((grant) => {
      const capability = CapabilityEnum.safeParse(grant.capability);
      const scope = CapabilityScopeSchema.safeParse(grant.scope);
      return capability.success && scope.success
        ? [
            {
              capability: capability.data,
              scope: scope.data,
              expiresAt: grant.expiresAt,
            },
          ]
        : [];
    });

    const resolved = resolveCapabilities({ roles, grants: direct, now });
    this.cache.set(key, { until: Date.now() + CACHE_MS, grants: resolved });
    return resolved;
  }

  // ───────────────────────── reading ─────────────────────────

  listCapabilities(): CapabilityInfoData[] {
    return CAPABILITY_VALUES.map((capability) => ({
      capability,
      ...CAPABILITY_CATALOG[capability],
    }));
  }

  async listRoles(schoolId: string): Promise<AccessRoleData[]> {
    const roles = await this.prisma.accessRole.findMany({
      where: { schoolId },
      select: roleSelect,
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
    return roles.map((role) => this.toRoleData(role));
  }

  async memberAccess(
    schoolId: string,
    userId: string,
  ): Promise<MemberAccessData> {
    const user = await this.requireUser(schoolId, userId);
    const [assigned, automatic, grants, effective] = await Promise.all([
      this.prisma.memberRole.findMany({
        where: { userId, schoolId },
        select: {
          id: true,
          scope: true,
          role: { select: { id: true, key: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.accessRole.findMany({
        where: { schoolId, defaultForKinds: { has: user.role } },
        select: { id: true, key: true, name: true },
      }),
      this.prisma.memberGrant.findMany({
        where: { userId, schoolId },
        orderBy: { createdAt: 'asc' },
      }),
      this.capabilitiesFor({ sub: userId, schoolId, role: user.role }),
    ]);

    return {
      userId,
      roles: [
        ...automatic.map((role) => ({
          assignmentId: `auto:${role.id}`,
          roleId: role.id,
          key: role.key,
          name: role.name,
          scope: 'SCHOOL',
          automatic: true,
        })),
        ...assigned.map((row) => ({
          assignmentId: row.id,
          roleId: row.role.id,
          key: row.role.key,
          name: row.role.name,
          scope: row.scope,
          automatic: false,
        })),
      ],
      grants: grants.flatMap((grant) => {
        const capability = CapabilityEnum.safeParse(grant.capability);
        return capability.success
          ? [
              {
                id: grant.id,
                capability: capability.data,
                scope: grant.scope,
                reason: grant.reason,
                expiresAt: grant.expiresAt?.toISOString() ?? null,
                grantedBy: grant.grantedBy,
              },
            ]
          : [];
      }),
      effective,
    };
  }

  // ───────────────────────── roles ─────────────────────────

  async createRole(
    actor: Actor,
    dto: CreateRoleData,
    context: RequestContext,
  ): Promise<AccessRoleData> {
    const capabilities = [...new Set(dto.capabilities)];
    await this.assertCanGive(actor, capabilities);

    const taken = await this.prisma.accessRole.findUnique({
      where: { schoolId_key: { schoolId: actor.schoolId, key: dto.key } },
      select: { id: true },
    });
    if (taken) throw new ConflictException('A role with that key exists.');

    const created = await this.prisma.$transaction(async (tx) => {
      const role = await tx.accessRole.create({
        data: {
          schoolId: actor.schoolId,
          key: dto.key,
          name: dto.name,
          description: dto.description ?? null,
          capabilities: {
            create: capabilities.map((capability) => ({ capability })),
          },
        },
        select: { id: true },
      });
      await this.audit.record(
        this.entry(
          actor,
          context,
          'access.role.create',
          'AccessRole',
          role.id,
          {
            newValues: { key: dto.key, name: dto.name, capabilities },
          },
        ),
        tx,
      );
      return role;
    });

    this.cache.clear();
    return this.roleData(created.id);
  }

  async updateRole(
    actor: Actor,
    roleId: string,
    dto: UpdateRoleData,
    context: RequestContext,
  ): Promise<AccessRoleData> {
    const role = await this.requireRole(actor.schoolId, roleId);
    if (role.locked) {
      throw new ForbiddenException('The super admin role cannot be edited.');
    }

    const before = known(role.capabilities);
    const after = dto.capabilities ? [...new Set(dto.capabilities)] : before;
    const added = after.filter((capability) => !before.includes(capability));
    await this.assertCanGive(actor, added);

    await this.prisma.$transaction(async (tx) => {
      if (dto.name !== undefined || dto.description !== undefined) {
        await tx.accessRole.update({
          where: { id: roleId },
          data: {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.description !== undefined && {
              description: dto.description,
            }),
          },
        });
      }
      if (dto.capabilities) {
        await tx.roleCapability.deleteMany({ where: { roleId } });
        await tx.roleCapability.createMany({
          data: after.map((capability) => ({ roleId, capability })),
        });
      }
      await this.audit.record(
        this.entry(actor, context, 'access.role.update', 'AccessRole', roleId, {
          oldValues: {
            name: role.name,
            description: role.description,
            capabilities: before,
          },
          newValues: {
            name: dto.name ?? role.name,
            description:
              dto.description !== undefined
                ? dto.description
                : role.description,
            capabilities: after,
          },
        }),
        tx,
      );
    });

    this.cache.clear();
    return this.roleData(roleId);
  }

  async deleteRole(actor: Actor, roleId: string, context: RequestContext) {
    const role = await this.requireRole(actor.schoolId, roleId);
    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted.');
    }
    if (role._count.members > 0) {
      throw new ConflictException(
        'This role still has people. Remove them from it first.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.accessRole.delete({ where: { id: roleId } });
      await this.audit.record(
        this.entry(actor, context, 'access.role.delete', 'AccessRole', roleId, {
          oldValues: { key: role.key, name: role.name },
        }),
        tx,
      );
    });
    this.cache.clear();
  }

  // ───────────────────────── people ─────────────────────────

  async assignRole(
    actor: Actor,
    userId: string,
    dto: AssignRoleData,
    context: RequestContext,
  ): Promise<MemberAccessData> {
    await this.requireUser(actor.schoolId, userId);
    const role = await this.requireRole(actor.schoolId, dto.roleId);
    await this.assertCanGive(actor, known(role.capabilities), dto.scope);

    const duplicate = await this.prisma.memberRole.findUnique({
      where: {
        userId_roleId_scope: { userId, roleId: role.id, scope: dto.scope },
      },
      select: { id: true },
    });
    if (duplicate) throw new ConflictException('They already hold this role.');

    await this.prisma.$transaction(async (tx) => {
      await tx.memberRole.create({
        data: {
          schoolId: actor.schoolId,
          userId,
          roleId: role.id,
          scope: dto.scope,
          assignedBy: actor.sub,
        },
      });
      await this.audit.record(
        this.entry(
          actor,
          context,
          'access.member.role.assign',
          'User',
          userId,
          {
            newValues: { role: role.key, scope: dto.scope },
          },
        ),
        tx,
      );
    });

    this.cache.delete(`${actor.schoolId}:${userId}`);
    return this.memberAccess(actor.schoolId, userId);
  }

  async removeRole(
    actor: Actor,
    userId: string,
    assignmentId: string,
    context: RequestContext,
  ) {
    const assignment = await this.prisma.memberRole.findFirst({
      where: { id: assignmentId, userId, schoolId: actor.schoolId },
      select: {
        id: true,
        scope: true,
        role: {
          select: { key: true, capabilities: { select: { capability: true } } },
        },
      },
    });
    if (!assignment)
      throw new NotFoundException('That role assignment was not found.');

    if (assignment.role.key === SUPER_ADMIN_KEY) {
      if (!(await this.isSuperAdmin(actor))) {
        throw new ForbiddenException(
          'Only a super admin can change a super admin.',
        );
      }
      const holders = await this.prisma.memberRole.count({
        where: { schoolId: actor.schoolId, role: { key: SUPER_ADMIN_KEY } },
      });
      if (holders <= 1) {
        throw new ConflictException(
          'There must always be at least one super admin.',
        );
      }
    }
    await this.assertCanGive(
      actor,
      known(assignment.role.capabilities),
      assignment.scope,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.memberRole.delete({ where: { id: assignmentId } });
      await this.audit.record(
        this.entry(
          actor,
          context,
          'access.member.role.remove',
          'User',
          userId,
          {
            oldValues: { role: assignment.role.key, scope: assignment.scope },
          },
        ),
        tx,
      );
    });
    this.cache.delete(`${actor.schoolId}:${userId}`);
  }

  async addGrant(
    actor: Actor,
    userId: string,
    dto: CreateGrantData,
    context: RequestContext,
  ): Promise<MemberAccessData> {
    await this.requireUser(actor.schoolId, userId);
    await this.assertCanGive(actor, [dto.capability], dto.scope);

    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      throw new ConflictException('The end date must be in the future.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.memberGrant.upsert({
        where: {
          userId_capability_scope: {
            userId,
            capability: dto.capability,
            scope: dto.scope,
          },
        },
        create: {
          schoolId: actor.schoolId,
          userId,
          capability: dto.capability,
          scope: dto.scope,
          reason: dto.reason,
          expiresAt,
          grantedBy: actor.sub,
        },
        update: { reason: dto.reason, expiresAt, grantedBy: actor.sub },
      });
      await this.audit.record(
        this.entry(actor, context, 'access.member.grant.add', 'User', userId, {
          newValues: {
            capability: dto.capability,
            scope: dto.scope,
            reason: dto.reason,
            expiresAt: expiresAt?.toISOString() ?? null,
          },
        }),
        tx,
      );
    });

    this.cache.delete(`${actor.schoolId}:${userId}`);
    return this.memberAccess(actor.schoolId, userId);
  }

  async removeGrant(
    actor: Actor,
    userId: string,
    grantId: string,
    context: RequestContext,
  ) {
    const grant = await this.prisma.memberGrant.findFirst({
      where: { id: grantId, userId, schoolId: actor.schoolId },
    });
    if (!grant) throw new NotFoundException('That grant was not found.');

    const capability = CapabilityEnum.safeParse(grant.capability);
    if (capability.success) {
      await this.assertCanGive(actor, [capability.data], grant.scope);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.memberGrant.delete({ where: { id: grantId } });
      await this.audit.record(
        this.entry(
          actor,
          context,
          'access.member.grant.remove',
          'User',
          userId,
          {
            oldValues: {
              capability: grant.capability,
              scope: grant.scope,
              reason: grant.reason,
            },
          },
        ),
        tx,
      );
    });
    this.cache.delete(`${actor.schoolId}:${userId}`);
  }

  // ───────────────────────── helpers ─────────────────────────

  private entry(
    actor: Actor,
    context: RequestContext,
    action: string,
    entityType: string,
    entityId: string,
    values: {
      oldValues?: Prisma.InputJsonValue;
      newValues?: Prisma.InputJsonValue;
    },
  ) {
    return {
      schoolId: actor.schoolId,
      actorUserId: actor.sub,
      actorRole: actor.role,
      actorPaideonId: actor.paideonId,
      action,
      entityType,
      entityId,
      ...values,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    };
  }

  private toRoleData(role: RoleRow): AccessRoleData {
    return {
      id: role.id,
      key: role.key,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      locked: role.locked,
      capabilities: known(role.capabilities),
      memberCount: role._count.members,
    };
  }

  private async roleData(roleId: string): Promise<AccessRoleData> {
    const role = await this.prisma.accessRole.findUniqueOrThrow({
      where: { id: roleId },
      select: roleSelect,
    });
    return this.toRoleData(role);
  }

  private async requireRole(schoolId: string, roleId: string) {
    const role = await this.prisma.accessRole.findFirst({
      where: { id: roleId, schoolId },
      select: roleSelect,
    });
    if (!role) throw new NotFoundException('That role was not found.');
    return role;
  }

  private async requireUser(schoolId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, schoolId, deletedAt: null },
      select: { id: true, role: true },
    });
    if (!user) throw new NotFoundException('That person was not found.');
    return user;
  }

  private async isSuperAdmin(actor: Actor) {
    const count = await this.prisma.memberRole.count({
      where: {
        userId: actor.sub,
        schoolId: actor.schoolId,
        role: { key: SUPER_ADMIN_KEY },
      },
    });
    return count > 0;
  }

  /**
   * Nobody can hand out, or take away, a capability they do not hold
   * themselves. Only a super admin is exempt, so access.manage alone can
   * never be used to climb higher than you already are.
   */
  private async assertCanGive(
    actor: Actor,
    capabilities: readonly CapabilityEnumData[],
    scope = 'SCHOOL',
  ) {
    if (capabilities.length === 0 || (await this.isSuperAdmin(actor))) return;
    const held = await this.capabilitiesFor(actor);
    const missing = capabilities.filter(
      (capability) => !holdsCapability(held, capability, scope),
    );
    if (missing.length > 0) {
      throw new ForbiddenException(
        `You can only give or remove capabilities you hold yourself: ${missing.join(', ')}.`,
      );
    }
  }
}
