import {
  ActivationInfoSchema,
  CapabilityGrantSchema,
  ChangePasswordSchema,
  ConfirmActivationSchema,
  CurrentUserSchema,
  MyFinesSchema,
  MyLoansSchema,
  SessionsSchema,
  UpdateMyContactSchema,
  fineBalance,
  isLoanOverdue,
  type LoanSummaryData,
  PASSWORD_RULES,
  ResetPasswordSchema,
  CAPABILITY_CATALOG,
  CAPABILITY_VALUES,
  CreateGrantSchema,
  UpdateRoleSchema,
  expandGrants,
  grantsForSystemRoles,
  holdsCapability,
  resolveCapabilities,
} from '@paideon/contracts';

describe('PASSWORD_RULES', () => {
  const candidates = [
    '',
    'short1A!',
    'Sh0rt!',
    'alllowercase1!',
    'ALLUPPERCASE1!',
    'NoDigits!!',
    'NoSpecial123',
    'Valid-pass1',
    'Valid_Pass9',
    'Ab1!' + 'x'.repeat(68), // 72 bytes: still fine
    'Ab1!' + 'x'.repeat(69), // 73 bytes: too long
    'Ab1!' + 'ක'.repeat(23), // Sinhala: 3 bytes each
  ];

  it.each(candidates)('agrees with the password schema for %j', (password) => {
    const rulesPass = PASSWORD_RULES.every((rule) => rule.test(password));
    const schemaPass = ResetPasswordSchema.safeParse({
      token: 't',
      newPassword: password,
      confirmPassword: password,
    }).success;
    expect(rulesPass).toBe(schemaPass);
  });
});

describe('capabilities', () => {
  it('gives the super admin every capability, school-wide', () => {
    const grants = grantsForSystemRoles(['super-admin']);
    expect(grants.map((g) => g.capability)).toEqual([...CAPABILITY_VALUES]);
    expect(grants.every((g) => g.scope === 'SCHOOL')).toBe(true);
  });

  it('gives a reader only their own library record and the catalog', () => {
    expect(grantsForSystemRoles(['reader']).map((g) => g.capability)).toEqual([
      'library.catalog.read',
      'library.own.read',
    ]);
  });

  it('gives a librarian only library capabilities', () => {
    const names = grantsForSystemRoles(['librarian']).map((g) => g.capability);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n.startsWith('library.'))).toBe(true);
  });

  it('gives nothing for a role it does not know', () => {
    expect(grantsForSystemRoles(['nobody'])).toEqual([]);
  });

  it('describes every capability for the access screen', () => {
    for (const capability of CAPABILITY_VALUES) {
      expect(CAPABILITY_CATALOG[capability].label.length).toBeGreaterThan(0);
    }
  });

  it('adds what a capability implies, at the same scope', () => {
    const names = expandGrants([
      { capability: 'library.desk', scope: 'SCHOOL' },
    ]).map((g) => g.capability);
    expect(names).toEqual(
      expect.arrayContaining([
        'library.desk',
        'library.catalog.read',
        'library.members.read',
      ]),
    );
  });

  it('lets a school-wide grant cover the same capability for one grade', () => {
    expect(
      expandGrants([
        { capability: 'people.read', scope: 'GRADE:7' },
        { capability: 'people.read', scope: 'SCHOOL' },
      ]),
    ).toEqual([{ capability: 'people.read', scope: 'SCHOOL' }]);
  });

  it('ignores a direct grant once it has ended', () => {
    const past = new Date(Date.now() - 1000);
    const future = new Date(Date.now() + 60_000);
    const held = (expiresAt: Date) =>
      resolveCapabilities({
        roles: [],
        grants: [{ capability: 'library.desk', scope: 'SCHOOL', expiresAt }],
      });
    expect(held(past)).toEqual([]);
    expect(held(future).map((g) => g.capability)).toContain('library.desk');
  });

  it('answers "do they hold it?" with the same scope rule as the portal', () => {
    const grants = [
      { capability: 'people.read', scope: 'GRADE:7' },
      { capability: 'library.desk', scope: 'SCHOOL' },
    ] as const;
    expect(holdsCapability(grants, 'people.read')).toBe(true);
    expect(holdsCapability(grants, 'people.read', 'GRADE:7')).toBe(true);
    expect(holdsCapability(grants, 'people.read', 'GRADE:8')).toBe(false);
    expect(holdsCapability(grants, 'library.desk', 'GRADE:8')).toBe(true);
    expect(holdsCapability(grants, 'audit.view')).toBe(false);
  });

  it('asks for a reason when giving a person an extra capability', () => {
    expect(
      CreateGrantSchema.safeParse({ capability: 'library.desk', reason: 'x' })
        .success,
    ).toBe(false);
    expect(
      CreateGrantSchema.safeParse({
        capability: 'library.desk',
        reason: 'Covering the desk this term',
      }).success,
    ).toBe(true);
  });

  it('refuses a role change that changes nothing', () => {
    expect(UpdateRoleSchema.safeParse({}).success).toBe(false);
    expect(UpdateRoleSchema.safeParse({ name: 'Helper' }).success).toBe(true);
  });

  it('accepts school, grade and class scopes only', () => {
    for (const scope of ['SCHOOL', 'GRADE:7', 'CLASS:abc_1']) {
      expect(
        CapabilityGrantSchema.safeParse({ capability: 'people.read', scope })
          .success,
      ).toBe(true);
    }
    for (const scope of ['school', 'GRADE:', 'GRADE:100', 'CLASS:', 'ALL']) {
      expect(
        CapabilityGrantSchema.safeParse({ capability: 'people.read', scope })
          .success,
      ).toBe(false);
    }
    expect(
      CapabilityGrantSchema.safeParse({ capability: 'nope', scope: 'SCHOOL' })
        .success,
    ).toBe(false);
  });
});

describe('CurrentUserSchema', () => {
  const user = {
    id: 'u1',
    schoolId: 's1',
    paideonId: 'PAI-STU-0001',
    email: 'a@school.lk',
    role: 'STUDENT',
    status: 'ACTIVE',
    firstName: 'A',
    lastName: 'B',
    displayName: null,
    cardNumber: 'C1',
    photoUrl: null,
    capabilities: [],
  };

  it('accepts what GET /auth/me returns', () => {
    expect(CurrentUserSchema.safeParse(user).success).toBe(true);
  });

  it('rejects a body without capabilities', () => {
    const { capabilities: _omit, ...rest } = user;
    expect(CurrentUserSchema.safeParse(rest).success).toBe(false);
  });
});

describe('ActivationInfoSchema', () => {
  it('needs name and email', () => {
    expect(
      ActivationInfoSchema.safeParse({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.c',
      }).success,
    ).toBe(true);
    expect(ActivationInfoSchema.safeParse({ firstName: 'A' }).success).toBe(
      false,
    );
  });
});

describe('ConfirmActivationSchema', () => {
  it('still rejects mismatched passwords', () => {
    const result = ConfirmActivationSchema.safeParse({
      token: 't',
      password: 'Valid-pass1',
      confirmPassword: 'Valid-pass2',
    });
    expect(result.success).toBe(false);
  });
});

describe('isLoanOverdue', () => {
  const now = new Date('2026-11-01T12:00:00Z');
  const loan = (over: Partial<LoanSummaryData>) =>
    ({
      status: 'ACTIVE',
      dueDate: '2026-10-30T00:00:00Z',
      returnDate: null,
      ...over,
    }) as LoanSummaryData;

  it('is overdue when still out and past due, even if status still says ACTIVE', () => {
    expect(isLoanOverdue(loan({}), now)).toBe(true);
  });
  it('is not overdue before the due date', () => {
    expect(isLoanOverdue(loan({ dueDate: '2026-11-05T00:00:00Z' }), now)).toBe(
      false,
    );
  });
  it('is never overdue once returned or lost', () => {
    expect(
      isLoanOverdue(
        loan({ status: 'RETURNED', returnDate: '2026-10-31T00:00:00Z' }),
        now,
      ),
    ).toBe(false);
    expect(isLoanOverdue(loan({ status: 'LOST' }), now)).toBe(false);
  });
});

describe('fineBalance', () => {
  it('is what is left to pay', () => {
    expect(
      fineBalance({ status: 'PENDING', amountLKR: 40, amountPaidLKR: 0 }),
    ).toBe(40);
    expect(
      fineBalance({ status: 'PARTIAL', amountLKR: 40, amountPaidLKR: 15.5 }),
    ).toBe(24.5);
  });
  it('is zero when paid or waived', () => {
    expect(
      fineBalance({ status: 'PAID', amountLKR: 40, amountPaidLKR: 40 }),
    ).toBe(0);
    expect(
      fineBalance({ status: 'WAIVED', amountLKR: 40, amountPaidLKR: 0 }),
    ).toBe(0);
  });
  it('never goes below zero', () => {
    expect(
      fineBalance({ status: 'PARTIAL', amountLKR: 10, amountPaidLKR: 12 }),
    ).toBe(0);
  });
});

describe('UpdateMyContactSchema', () => {
  const ok = (v: unknown) => UpdateMyContactSchema.safeParse(v);

  it('accepts usual Sri Lankan phone formats', () => {
    for (const phone of [
      '0771234567',
      '077 123 4567',
      '+94 77 123 4567',
      '(011) 234-5678',
    ]) {
      expect(ok({ phone, address: '12 Temple Road' }).success).toBe(true);
    }
  });
  it('turns empty text into null (clearing a field)', () => {
    const r = ok({ phone: '  ', address: '' });
    expect(r.success).toBe(true);
    expect(r.success && r.data).toEqual({ phone: null, address: null });
  });
  it('rejects letters and too-short numbers', () => {
    expect(ok({ phone: 'call me', address: '' }).success).toBe(false);
    expect(ok({ phone: '12345', address: '' }).success).toBe(false);
  });
  it('rejects overlong address and unknown fields', () => {
    expect(ok({ phone: '', address: 'x'.repeat(301) }).success).toBe(false);
    expect(ok({ phone: '', address: '', role: 'ADMIN' }).success).toBe(false);
  });
});

describe('ChangePasswordSchema', () => {
  const base = {
    currentPassword: 'Old-pass1',
    newPassword: 'New-pass1',
    confirmPassword: 'New-pass1',
  };
  it('accepts a valid change', () => {
    expect(ChangePasswordSchema.safeParse(base).success).toBe(true);
  });
  it('needs the current password', () => {
    expect(
      ChangePasswordSchema.safeParse({ ...base, currentPassword: '' }).success,
    ).toBe(false);
  });
  it('applies the same rules as activation to the new password', () => {
    expect(
      ChangePasswordSchema.safeParse({
        ...base,
        newPassword: 'weak',
        confirmPassword: 'weak',
      }).success,
    ).toBe(false);
  });
  it('rejects a mismatch and an unchanged password', () => {
    expect(
      ChangePasswordSchema.safeParse({
        ...base,
        confirmPassword: 'Other-pass1',
      }).success,
    ).toBe(false);
    expect(
      ChangePasswordSchema.safeParse({ ...base, currentPassword: 'New-pass1' })
        .success,
    ).toBe(false);
  });
});

describe('MyProfileSchema, LoanSummarySchema, FineSchema, SessionSchema', () => {
  it('accept what the API sends', () => {
    expect(
      MyLoansSchema.safeParse([
        {
          id: 'l1',
          checkoutDate: '2026-10-20T00:00:00.000Z',
          dueDate: '2026-11-03T00:00:00.000Z',
          returnDate: null,
          status: 'ACTIVE',
          renewalCount: 0,
          copy: { code: 'B-1', book: { id: 'b1', title: 'T', authors: ['A'] } },
        },
      ]).success,
    ).toBe(true);
    expect(
      MyFinesSchema.safeParse([
        {
          id: 'f1',
          type: 'OVERDUE',
          status: 'PENDING',
          amountLKR: 40,
          amountPaidLKR: 0,
          daysOverdue: 20,
          createdAt: '2026-10-30T00:00:00.000Z',
          paidAt: null,
          bookTitle: 'T',
        },
      ]).success,
    ).toBe(true);
    expect(
      SessionsSchema.safeParse([
        {
          id: 's1',
          lastActiveAt: '2026-11-01T00:00:00.000Z',
          expiresAt: '2026-12-01T00:00:00.000Z',
          ipAddress: null,
          userAgent: null,
          current: true,
        },
      ]).success,
    ).toBe(true);
  });
  it('reject a loan with an unknown status', () => {
    expect(
      MyLoansSchema.safeParse([
        {
          id: 'l1',
          checkoutDate: '',
          dueDate: '',
          returnDate: null,
          status: 'LOANED',
          renewalCount: 0,
          copy: { code: '', book: { id: '', title: '', authors: [] } },
        },
      ]).success,
    ).toBe(false);
  });
});
