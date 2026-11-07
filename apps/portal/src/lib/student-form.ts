// The student form keeps every field as text while the person types. These
// functions convert between that and what the API sends and returns.

import { PREFER_NOT_TO_SAY, type StudentData } from '@paideon/contracts';

export type GuardianFormState = {
  name: string;
  relationship: string;
  phone: string;
};

export type StudentFormState = {
  firstName: string;
  lastName: string;
  nameWithInitials: string;
  nameLocal: string;
  nameLocalLanguage: '' | 'SINHALA' | 'TAMIL';
  dateOfBirth: string;
  gender: '' | 'MALE' | 'FEMALE';
  /** '' = not recorded, PREFER_NOT_TO_SAY, or the text itself. */
  religion: string;
  ethnicity: string;
  line1: string;
  line2: string;
  city: string;
  district: string;
  admissionNumber: string;
  admissionDate: string;
  gradeAtAdmission: string;
  currentGrade: string;
  classId: string | null;
  medium: '' | 'SINHALA' | 'TAMIL' | 'ENGLISH';
  guardians: GuardianFormState[];
  email: string;
};

export const emptyGuardian = (): GuardianFormState => ({
  name: '',
  relationship: '',
  phone: '',
});

export const emptyStudentForm = (): StudentFormState => ({
  firstName: '',
  lastName: '',
  nameWithInitials: '',
  nameLocal: '',
  nameLocalLanguage: '',
  dateOfBirth: '',
  gender: '',
  religion: '',
  ethnicity: '',
  line1: '',
  line2: '',
  city: '',
  district: '',
  admissionNumber: '',
  admissionDate: '',
  gradeAtAdmission: '',
  currentGrade: '',
  classId: null,
  medium: '',
  guardians: [emptyGuardian()],
  email: '',
});

export function formFromStudent(student: StudentData): StudentFormState {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    nameWithInitials: student.nameWithInitials ?? '',
    nameLocal: student.nameLocal ?? '',
    nameLocalLanguage: student.nameLocalLanguage ?? '',
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    religion: student.religion ?? '',
    ethnicity: student.ethnicity ?? '',
    line1: student.address?.line1 ?? '',
    line2: student.address?.line2 ?? '',
    city: student.address?.city ?? '',
    district: student.address?.district ?? '',
    admissionNumber: student.admissionNumber,
    admissionDate: student.admissionDate,
    gradeAtAdmission: String(student.gradeAtAdmission),
    currentGrade: String(student.grade),
    classId: student.classId,
    medium: student.medium,
    guardians:
      student.guardians.length > 0
        ? student.guardians.map((guardian) => ({
            name: guardian.name,
            relationship: guardian.relationship,
            phone: guardian.phone ?? '',
          }))
        : [emptyGuardian()],
    email: student.email,
  };
}

const isBlank = (guardian: GuardianFormState) =>
  !guardian.name.trim() && !guardian.phone.trim() && !guardian.relationship;

export type BodyOptions = {
  /** Edit mode, viewer may not see religion and ethnicity: leave them out so they are not wiped. */
  includeSensitive: boolean;
  /** Edit mode, guardian phones hidden from the viewer: leave guardians out. */
  includeGuardians: boolean;
  /** Edit mode never sends the email: it is changed from Accounts. */
  includeEmail: boolean;
};

/** What goes to the API (and the shared schema) from the typed-in form. */
export function bodyFromForm(
  state: StudentFormState,
  options: BodyOptions,
): Record<string, unknown> {
  const number = (text: string) => (text === '' ? undefined : Number(text));
  const body: Record<string, unknown> = {
    firstName: state.firstName,
    lastName: state.lastName,
    nameWithInitials: state.nameWithInitials,
    nameLocal: state.nameLocal,
    nameLocalLanguage: state.nameLocalLanguage || null,
    dateOfBirth: state.dateOfBirth,
    gender: state.gender || undefined,
    address: {
      line1: state.line1,
      line2: state.line2,
      city: state.city,
      district: state.district,
    },
    admissionNumber: state.admissionNumber,
    admissionDate: state.admissionDate,
    gradeAtAdmission: number(state.gradeAtAdmission),
    currentGrade: number(state.currentGrade),
    classId: state.classId || null,
    medium: state.medium || undefined,
  };
  if (options.includeSensitive) {
    body.religion = state.religion || null;
    body.ethnicity = state.ethnicity || null;
  }
  if (options.includeGuardians) {
    body.guardians = state.guardians
      .filter((guardian, index) => index === 0 || !isBlank(guardian))
      .map((guardian) => ({
        name: guardian.name,
        relationship: guardian.relationship || undefined,
        phone: guardian.phone,
      }));
  }
  if (options.includeEmail) body.email = state.email;
  return body;
}

/** Is this stored religion/ethnicity value one of the choices we list? */
export function isPresetChoice(
  value: string,
  presets: readonly string[],
): boolean {
  return value === '' || value === PREFER_NOT_TO_SAY || presets.includes(value);
}
