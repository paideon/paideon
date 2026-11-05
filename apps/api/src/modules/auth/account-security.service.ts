import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';
import type { ChangePasswordData, SessionData } from '@paideon/contracts';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './types/jwt-payload.type';

type RequestContext = {
  /** The raw refresh_token cookie of this request, if the browser sent it. */
  refreshToken?: string;
  ipAddress?: string;
  userAgent?: string;
};

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

// What a signed-in person can do about their own sign-in: change the
// password, see where they are signed in, sign out everywhere.
@Injectable()
export class AccountSecurityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async changePassword(
    actor: JwtPayload,
    dto: ChangePasswordData,
    context: RequestContext,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: actor.sub, schoolId: actor.schoolId, status: 'ACTIVE' },
      select: { id: true, password: true },
    });

    // 400 with a code, never 401: the portal treats a 401 as "session gone".
    const currentOk =
      user?.password != null &&
      (await bcrypt.compare(dto.currentPassword, user.password));
    if (!user || !currentOk) {
      throw new BadRequestException({
        message: 'Your current password is not correct.',
        code: 'WRONG_CURRENT_PASSWORD',
      });
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    const now = new Date();
    const keepHash = context.refreshToken
      ? hashToken(context.refreshToken)
      : null;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { password: passwordHash, passwordChangedAt: now },
      });

      // Everywhere else is signed out. This browser stays signed in.
      await tx.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
          ...(keepHash ? { tokenHash: { not: keepHash } } : {}),
        },
        data: { revokedAt: now },
      });

      await this.audit.record(
        {
          schoolId: actor.schoolId,
          actorUserId: actor.sub,
          actorRole: actor.kind,
          actorPaideonId: actor.paideonId,
          action: 'auth.password.change',
          entityType: 'User',
          entityId: user.id,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        },
        tx,
      );
    });
  }

  async listSessions(
    actor: JwtPayload,
    context: RequestContext,
  ): Promise<SessionData[]> {
    const currentHash = context.refreshToken
      ? hashToken(context.refreshToken)
      : null;

    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: actor.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        tokenHash: true,
        createdAt: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
      },
    });

    return tokens.map((token) => ({
      id: token.id,
      lastActiveAt: token.createdAt.toISOString(),
      expiresAt: token.expiresAt.toISOString(),
      ipAddress: token.ipAddress,
      userAgent: token.userAgent,
      current: currentHash !== null && token.tokenHash === currentHash,
    }));
  }

  /** Ends every session, this one included. Returns how many were ended. */
  async signOutEverywhere(
    actor: JwtPayload,
    context: RequestContext,
  ): Promise<number> {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.refreshToken.updateMany({
        where: { userId: actor.sub, revokedAt: null },
        data: { revokedAt: now },
      });

      await this.audit.record(
        {
          schoolId: actor.schoolId,
          actorUserId: actor.sub,
          actorRole: actor.kind,
          actorPaideonId: actor.paideonId,
          action: 'auth.sessions.revoke_all',
          entityType: 'User',
          entityId: actor.sub,
          newValues: { sessionsEnded: count },
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        },
        tx,
      );
      return count;
    });
  }
}
