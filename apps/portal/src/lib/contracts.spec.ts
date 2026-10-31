import {
  ActivationInfoSchema,
  CapabilityGrantSchema,
  ConfirmActivationSchema,
  CurrentUserSchema,
  PASSWORD_RULES,
  ResetPasswordSchema,
  capabilitiesForRole,
  CAPABILITY_VALUES,
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
  it('gives an admin every capability, school-wide', () => {
    const grants = capabilitiesForRole('ADMIN');
    expect(grants.map((g) => g.capability)).toEqual([...CAPABILITY_VALUES]);
    expect(grants.every((g) => g.scope === 'SCHOOL')).toBe(true);
  });

  it('gives a librarian only library capabilities', () => {
    const names = capabilitiesForRole('LIBRARIAN').map((g) => g.capability);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n.startsWith('library.'))).toBe(true);
  });

  it('gives students, parents, teachers and staff nothing yet', () => {
    for (const role of ['STUDENT', 'PARENT', 'TEACHER', 'STAFF'] as const) {
      expect(capabilitiesForRole(role)).toEqual([]);
    }
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
