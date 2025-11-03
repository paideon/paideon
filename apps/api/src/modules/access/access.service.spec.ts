import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AccessService } from './access.service';

type Fake = Record<string, Record<string, jest.Mock>>;

// A hand-made stand-in for PrismaService: each test sets only what it needs.
function build(overrides: Partial<Fake> = {}) {
  const prisma: Fake & { $transaction: jest.Mock } = {
    memberRole: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findFirst: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      delete: jest.fn(),
    },
    accessRole: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
    },
    memberGrant: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn(),
    },
    user: {
      findFirst: jest.fn().mockResolvedValue({ id: 'u2', role: 'STAFF' }),
    },
    $transaction: jest.fn(),
    ...overrides,
  } as never;
  prisma.$transaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
    fn(prisma),
  );
  const audit = { record: jest.fn() };
  const service = new AccessService(prisma as never, audit as never);
  return { service, prisma, audit };
}

const actor = {
  sub: 'u1',
  schoolId: 's1',
  role: 'STAFF' as const,
  paideonId: 'P-1',
};

const caps = (...names: string[]) =>
  names.map((capability) => ({ capability }));

describe('AccessService.capabilitiesFor', () => {
  it('adds up an assigned role, an automatic role and a grant', async () => {
    const { service, prisma } = build();
    prisma['memberRole']['findMany'].mockResolvedValue([
      { scope: 'SCHOOL', role: { capabilities: caps('library.desk') } },
    ]);
    prisma['accessRole']['findMany'].mockResolvedValue([
      { capabilities: caps('library.own.read') },
    ]);
    prisma['memberGrant']['findMany'].mockResolvedValue([
      { capability: 'people.read', scope: 'GRADE:7', expiresAt: null },
    ]);

    const result = await service.capabilitiesFor(actor);
    const names = result.map((g) => `${g.capability}@${g.scope}`);

    expect(names).toEqual(
      expect.arrayContaining([
        'library.desk@SCHOOL',
        'library.own.read@SCHOOL',
        'people.read@GRADE:7',
        // implied by library.desk
        'library.catalog.read@SCHOOL',
        'library.members.read@SCHOOL',
      ]),
    );
  });

  it('ignores a capability name the code no longer knows', async () => {
    const { service, prisma } = build();
    prisma['memberRole']['findMany'].mockResolvedValue([
      { scope: 'SCHOOL', role: { capabilities: caps('retired.thing') } },
    ]);
    expect(await service.capabilitiesFor(actor)).toEqual([]);
  });

  it('reuses a recent answer instead of asking the database again', async () => {
    const { service, prisma } = build();
    await service.capabilitiesFor(actor);
    await service.capabilitiesFor(actor);
    expect(prisma['memberRole']['findMany']).toHaveBeenCalledTimes(1);
  });
});

describe('AccessService: nobody climbs higher than they are', () => {
  it('refuses to put a capability you do not hold into a new role', async () => {
    const { service, prisma } = build();
    // The actor holds only library.desk and is not a super admin.
    prisma['memberRole']['findMany'].mockResolvedValue([
      { scope: 'SCHOOL', role: { capabilities: caps('library.desk') } },
    ]);
    await expect(
      service.createRole(
        actor,
        { key: 'sneaky', name: 'Sneaky', capabilities: ['audit.view'] },
        {},
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('lets a super admin give any capability', async () => {
    const { service, prisma } = build();
    prisma['memberRole']['count'].mockResolvedValue(1); // holds super-admin
    prisma['accessRole']['create'].mockResolvedValue({ id: 'r1' });
    prisma['accessRole']['findUniqueOrThrow'] = jest.fn().mockResolvedValue({
      id: 'r1',
      key: 'helper',
      name: 'Helper',
      description: null,
      isSystem: false,
      locked: false,
      capabilities: caps('audit.view'),
      _count: { members: 0 },
    });
    const role = await service.createRole(
      actor,
      { key: 'helper', name: 'Helper', capabilities: ['audit.view'] },
      {},
    );
    expect(role.capabilities).toEqual(['audit.view']);
  });
});

describe('AccessService.removeRole', () => {
  it('never removes the last super admin', async () => {
    const { service, prisma } = build();
    prisma['memberRole']['findFirst'].mockResolvedValue({
      id: 'm1',
      scope: 'SCHOOL',
      role: { key: 'super-admin', capabilities: caps('access.manage') },
    });
    // The actor is a super admin; only one super admin exists.
    prisma['memberRole']['count']
      .mockResolvedValueOnce(1) // isSuperAdmin(actor)
      .mockResolvedValueOnce(1); // holders of the role
    await expect(
      service.removeRole(actor, 'u2', 'm1', {}),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma['memberRole']['delete']).not.toHaveBeenCalled();
  });

  it('stops someone who is not a super admin from changing one', async () => {
    const { service, prisma } = build();
    prisma['memberRole']['findFirst'].mockResolvedValue({
      id: 'm1',
      scope: 'SCHOOL',
      role: { key: 'super-admin', capabilities: caps('access.manage') },
    });
    prisma['memberRole']['count'].mockResolvedValueOnce(0); // not a super admin
    await expect(
      service.removeRole(actor, 'u2', 'm1', {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
