import { CreateStudentSchema } from '@paideon/contracts';

import {
  bodyFromForm,
  emptyGuardian,
  emptyStudentForm,
  type StudentFormState,
} from './student-form';

const year = new Date().getUTCFullYear();

const filled = (): StudentFormState => ({
  ...emptyStudentForm(),
  firstName: 'Nimal',
  lastName: 'Perera',
  dateOfBirth: `${year - 15}-03-04`,
  gender: 'MALE',
  line1: '12 Temple Road',
  admissionNumber: 'A/4521',
  admissionDate: `${year - 5}-01-10`,
  gradeAtAdmission: '6',
  currentGrade: '10',
  medium: 'SINHALA',
  guardians: [
    { name: 'Kamala', relationship: 'MOTHER', phone: '077 123 4567' },
  ],
  email: 'Nimal@School.lk',
});

const all = {
  includeSensitive: true,
  includeGuardians: true,
  includeEmail: true,
};

describe('bodyFromForm', () => {
  it('builds a body the create schema accepts', () => {
    const parsed = CreateStudentSchema.safeParse(bodyFromForm(filled(), all));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe('nimal@school.lk');
      expect(parsed.data.guardians[0].phone).toBe('+94771234567');
      expect(parsed.data.religion).toBe(null);
    }
  });

  it('reports an untouched form as missing fields, not as a crash', () => {
    const parsed = CreateStudentSchema.safeParse(
      bodyFromForm(emptyStudentForm(), all),
    );
    expect(parsed.success).toBe(false);
  });

  it('drops a blank second guardian but keeps the first', () => {
    const state = {
      ...filled(),
      guardians: [filled().guardians[0], emptyGuardian()],
    };
    expect((bodyFromForm(state, all).guardians as unknown[]).length).toBe(1);
  });

  it('leaves out what the viewer may not see, so it is not wiped', () => {
    const body = bodyFromForm(filled(), {
      includeSensitive: false,
      includeGuardians: false,
      includeEmail: false,
    });
    expect('religion' in body).toBe(false);
    expect('guardians' in body).toBe(false);
    expect('email' in body).toBe(false);
  });
});
