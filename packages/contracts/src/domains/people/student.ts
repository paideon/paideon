// Students: what the list, the profile and the forms send and receive.
// Dates travel as ISO strings (or YYYY-MM-DD for calendar dates).

import { z } from 'zod';
import {
  paginated,
  PaginationQuerySchema,
  SortDirectionEnum,
} from '../../shared/pagination.ts';
import { AccountStatusEnum } from '../users/account-status.ts';
import {
  DateOnlySchema,
  GenderEnum,
  LocalNameLanguageEnum,
  MediumEnum,
  NameSchema,
  OptionalTextSchema,
  optionalChoiceSchema,
  SriLankanPhoneSchema,
} from './common.ts';

export const MIN_GRADE = 1;
export const MAX_GRADE = 13;

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export const STUDENT_STATUS_VALUES = [
  'ACTIVE',
  'TRANSFERRED_OUT',
  'LEFT',
  'GRADUATED',
] as const;
export const StudentStatusEnum = z.enum(STUDENT_STATUS_VALUES);
export type StudentStatusEnumData = z.infer<typeof StudentStatusEnum>;

export const STUDENT_STATUS_LABELS: Record<StudentStatusEnumData, string> = {
  ACTIVE: 'Active',
  TRANSFERRED_OUT: 'Transferred out',
  LEFT: 'Left',
  GRADUATED: 'Graduated',
};

export const ChangeStudentStatusSchema = z
  .object({
    status: StudentStatusEnum,
    effectiveDate: DateOnlySchema,
    reason: OptionalTextSchema(300, 'Reason must be at most 300 characters.'),
  })
  .strict();
export type ChangeStudentStatusData = z.infer<typeof ChangeStudentStatusSchema>;

// ---------------------------------------------------------------------------
// Guardians
// ---------------------------------------------------------------------------

export const GUARDIAN_RELATIONSHIP_VALUES = [
  'MOTHER',
  'FATHER',
  'GUARDIAN',
  'GRANDMOTHER',
  'GRANDFATHER',
  'AUNT',
  'UNCLE',
  'SIBLING',
  'OTHER',
] as const;
export const GuardianRelationshipEnum = z.enum(GUARDIAN_RELATIONSHIP_VALUES);
export type GuardianRelationshipEnumData = z.infer<
  typeof GuardianRelationshipEnum
>;

export const GUARDIAN_RELATIONSHIP_LABELS: Record<
  GuardianRelationshipEnumData,
  string
> = {
  MOTHER: 'Mother',
  FATHER: 'Father',
  GUARDIAN: 'Guardian',
  GRANDMOTHER: 'Grandmother',
  GRANDFATHER: 'Grandfather',
  AUNT: 'Aunt',
  UNCLE: 'Uncle',
  SIBLING: 'Brother or sister',
  OTHER: 'Other',
};

/** What a form sends for one guardian. */
export const GuardianInputSchema = z.object({
  name: NameSchema('the guardian name'),
  relationship: GuardianRelationshipEnum,
  phone: SriLankanPhoneSchema,
});
export type GuardianInputData = z.infer<typeof GuardianInputSchema>;

/** What the server returns for one guardian. The phone is null when hidden. */
export const GuardianSchema = z.object({
  id: z.string(),
  name: z.string(),
  relationship: z.string(),
  phone: z.string().nullable(),
  isPrimary: z.boolean(),
});
export type GuardianData = z.infer<typeof GuardianSchema>;

// ---------------------------------------------------------------------------
// Address
// ---------------------------------------------------------------------------

export const AddressInputSchema = z.object({
  line1: z
    .string({ required_error: 'Enter the home address.' })
    .trim()
    .min(1, 'Enter the home address.')
    .max(120, 'Address line must be at most 120 characters.'),
  line2: OptionalTextSchema(
    120,
    'Address line must be at most 120 characters.',
  ),
  city: OptionalTextSchema(60, 'Town must be at most 60 characters.'),
  district: OptionalTextSchema(60, 'District must be at most 60 characters.'),
});
export type AddressInputData = z.infer<typeof AddressInputSchema>;

export const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string().nullable(),
  district: z.string().nullable(),
});
export type AddressData = z.infer<typeof AddressSchema>;

// ---------------------------------------------------------------------------
// Date of birth against grade
// ---------------------------------------------------------------------------

/**
 * Children start Grade 1 at about 5 or 6, so a Grade g student is about g + 5.
 * The window is wide (g + 3 to g + 10) because of late starters and repeats;
 * it only catches typing slips such as a birth year in the wrong decade.
 */
export function ageRangeForGrade(grade: number): { min: number; max: number } {
  return { min: grade + 3, max: grade + 10 };
}

/** Age in whole years on the first of January of `onYear`'s school year. */
export function ageOnJanuaryFirst(dateOfBirth: string, onYear: number): number {
  return onYear - Number(dateOfBirth.slice(0, 4));
}

export function isPlausibleDateOfBirthForGrade(
  dateOfBirth: string,
  grade: number,
  now: Date = new Date(),
): boolean {
  const age = ageOnJanuaryFirst(dateOfBirth, now.getUTCFullYear());
  const { min, max } = ageRangeForGrade(grade);
  return age >= min && age <= max;
}

// ---------------------------------------------------------------------------
// Create / update
// ---------------------------------------------------------------------------

const gradeSchema = (label: string) =>
  z
    .number({
      invalid_type_error: `Choose ${label}.`,
      required_error: `Choose ${label}.`,
    })
    .int(`Choose ${label}.`)
    .min(MIN_GRADE, `Choose ${label}.`)
    .max(MAX_GRADE, `Choose ${label}.`);

const studentFieldShape = {
  firstName: NameSchema('the first name'),
  lastName: NameSchema('the last name'),
  nameWithInitials: OptionalTextSchema(100, 'Must be at most 100 characters.'),
  nameLocal: OptionalTextSchema(120, 'Must be at most 120 characters.'),
  nameLocalLanguage: LocalNameLanguageEnum.nullish().transform(
    (value) => value ?? null,
  ),
  dateOfBirth: DateOnlySchema,
  gender: GenderEnum,
  religion: optionalChoiceSchema,
  ethnicity: optionalChoiceSchema,
  address: AddressInputSchema,
  admissionNumber: z
    .string({ required_error: 'Enter the admission number.' })
    .trim()
    .min(1, 'Enter the admission number.')
    .max(20, 'Admission number must be at most 20 characters.')
    .regex(/^[A-Za-z0-9/-]+$/, 'Use letters, numbers, / and - only.'),
  admissionDate: DateOnlySchema,
  gradeAtAdmission: gradeSchema('the grade at admission'),
  currentGrade: gradeSchema('the current grade'),
  /** The class (grade + section) in the current academic year; null if not placed yet. */
  classId: z.string().min(1).nullable(),
  medium: MediumEnum,
  guardians: z
    .array(GuardianInputSchema)
    .min(1, 'Add at least one guardian.')
    .max(2, 'Add at most two guardians.'),
};

type StudentFieldsPartial = {
  nameLocal?: string | null;
  nameLocalLanguage?: 'SINHALA' | 'TAMIL' | null;
  dateOfBirth?: string;
  admissionDate?: string;
  gradeAtAdmission?: number;
  currentGrade?: number;
};

/** Checks that involve more than one field. Runs on whatever fields are present. */
function checkStudentFields(
  value: StudentFieldsPartial,
  ctx: z.RefinementCtx,
): void {
  if (value.nameLocal !== undefined && value.nameLocalLanguage !== undefined) {
    if (value.nameLocal && !value.nameLocalLanguage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nameLocalLanguage'],
        message: 'Choose Sinhala or Tamil.',
      });
    }
    if (!value.nameLocal && value.nameLocalLanguage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nameLocal'],
        message: 'Enter the name in that language, or clear the language.',
      });
    }
  }
  if (
    value.currentGrade !== undefined &&
    value.gradeAtAdmission !== undefined &&
    value.currentGrade < value.gradeAtAdmission
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['currentGrade'],
      message: 'The current grade cannot be lower than the grade at admission.',
    });
  }
  if (
    value.dateOfBirth &&
    value.admissionDate &&
    value.admissionDate <= value.dateOfBirth
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['admissionDate'],
      message: 'The admission date must be after the date of birth.',
    });
  }
  if (value.dateOfBirth && value.currentGrade !== undefined) {
    if (value.dateOfBirth > new Date().toISOString().slice(0, 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateOfBirth'],
        message: 'The date of birth cannot be in the future.',
      });
    } else if (
      !isPlausibleDateOfBirthForGrade(value.dateOfBirth, value.currentGrade)
    ) {
      const { min, max } = ageRangeForGrade(value.currentGrade);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateOfBirth'],
        message: `This date of birth does not fit Grade ${value.currentGrade} (students are usually ${min} to ${max}). Check the date or the grade.`,
      });
    }
  }
}

const emailSchema = z
  .string({ required_error: 'Enter the school email.' })
  .trim()
  .toLowerCase()
  .min(1, 'Enter the school email.')
  .max(254, 'Email is too long.')
  .email('Enter a valid email address.');

export const CreateStudentSchema = z
  .object({ ...studentFieldShape, email: emailSchema })
  .strict()
  .superRefine(checkStudentFields);
export type CreateStudentData = z.infer<typeof CreateStudentSchema>;

/** Same fields as create, every one optional. The email is changed from Accounts, not here. */
export const UpdateStudentSchema = z
  .object(studentFieldShape)
  .partial()
  .strict()
  .superRefine(checkStudentFields);
export type UpdateStudentData = z.infer<typeof UpdateStudentSchema>;

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export const STUDENT_SORT_VALUES = [
  'name',
  'admissionNumber',
  'class',
] as const;
export const StudentSortEnum = z.enum(STUDENT_SORT_VALUES);

export const STUDENT_MISSING_VALUES = [
  'PHOTO',
  'GUARDIAN_PHONE',
  'CLASS',
] as const;
export const StudentMissingEnum = z.enum(STUDENT_MISSING_VALUES);
export type StudentMissingEnumData = z.infer<typeof StudentMissingEnum>;

export const STUDENT_MISSING_LABELS: Record<StudentMissingEnumData, string> = {
  PHOTO: 'No photo',
  GUARDIAN_PHONE: 'No guardian phone',
  CLASS: 'No class this year',
};

const csvOfIds = z
  .union([z.string(), z.array(z.string())])
  .transform((value) =>
    (Array.isArray(value) ? value : value.split(','))
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  )
  .refine((ids) => ids.length <= 500, 'Too many students selected.');

const flag = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
  .transform((value) => value === true || value === 'true' || value === '1');

export const StudentListQuerySchema = PaginationQuerySchema.extend({
  q: z.string().trim().max(80).optional(),
  grade: z.coerce.number().int().min(MIN_GRADE).max(MAX_GRADE).optional(),
  classId: z.string().min(1).optional(),
  medium: MediumEnum.optional(),
  gender: GenderEnum.optional(),
  /** Defaults to active students; ALL shows every status. */
  status: z.union([StudentStatusEnum, z.literal('ALL')]).default('ACTIVE'),
  missingPhoto: flag.optional(),
  missingGuardianPhone: flag.optional(),
  /** Restrict to these students (used by bulk badge printing and CSV export). */
  ids: csvOfIds.optional(),
  sort: StudentSortEnum.default('name'),
  dir: SortDirectionEnum.default('asc'),
});
export type StudentListQueryData = z.infer<typeof StudentListQuerySchema>;
/** What the browser builds before parsing (all optional text). */
export type StudentListQueryInput = z.input<typeof StudentListQuerySchema>;

export const StudentSummarySchema = z.object({
  id: z.string(),
  paideonId: z.string(),
  cardNumber: z.string(),
  admissionNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  photoUrl: z.string().nullable(),
  grade: z.number().int(),
  section: z.string().nullable(),
  classId: z.string().nullable(),
  medium: MediumEnum,
  gender: GenderEnum,
  status: StudentStatusEnum,
  accountStatus: AccountStatusEnum,
  /** Null when there is none, or when the viewer may not see it. */
  guardianPhone: z.string().nullable(),
  missing: z.array(StudentMissingEnum),
});
export type StudentSummaryData = z.infer<typeof StudentSummarySchema>;

export const StudentListSchema = paginated(StudentSummarySchema);
export type StudentListData = z.infer<typeof StudentListSchema>;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const ClassHistoryEntrySchema = z.object({
  id: z.string(),
  academicYear: z.string(),
  grade: z.number().int(),
  section: z.string(),
  enrolledAt: z.string(),
  status: z.string(),
  note: z.string().nullable(),
  isCurrent: z.boolean(),
});
export type ClassHistoryEntryData = z.infer<typeof ClassHistoryEntrySchema>;

export const StatusChangeSchema = z.object({
  id: z.string(),
  fromStatus: StudentStatusEnum,
  toStatus: StudentStatusEnum,
  effectiveDate: z.string(),
  reason: z.string().nullable(),
  createdAt: z.string(),
});
export type StatusChangeData = z.infer<typeof StatusChangeSchema>;

export const StudentSchema = StudentSummarySchema.extend({
  email: z.string(),
  nameWithInitials: z.string().nullable(),
  nameLocal: z.string().nullable(),
  nameLocalLanguage: LocalNameLanguageEnum.nullable(),
  dateOfBirth: z.string(),
  /** Null when the viewer lacks people.sensitive.read; "Not recorded" is also null, see `sensitiveVisible`. */
  religion: z.string().nullable(),
  ethnicity: z.string().nullable(),
  /** False when religion and ethnicity were withheld from this viewer. */
  sensitiveVisible: z.boolean(),
  address: AddressSchema.nullable(),
  admissionDate: z.string(),
  gradeAtAdmission: z.number().int(),
  guardians: z.array(GuardianSchema),
  /** Current class in the current academic year, e.g. "10-A". */
  classLabel: z.string().nullable(),
  classHistory: z.array(ClassHistoryEntrySchema),
  statusHistory: z.array(StatusChangeSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type StudentData = z.infer<typeof StudentSchema>;

// ---------------------------------------------------------------------------
// Photo
// ---------------------------------------------------------------------------

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export const PHOTO_SIZES = { small: 64, medium: 256, large: 600 } as const;

/** Fields sent alongside the file (multipart) when uploading a photo. */
export const StudentPhotoUploadSchema = z
  .object({
    /** Square crop chosen in the browser, as fractions of the original image. */
    cropX: z.coerce.number().min(0).max(1).default(0),
    cropY: z.coerce.number().min(0).max(1).default(0),
    cropSize: z.coerce.number().gt(0).max(1).default(1),
  })
  .strict();
export type StudentPhotoUploadData = z.infer<typeof StudentPhotoUploadSchema>;

export const StudentPhotoResultSchema = z.object({ photoUrl: z.string() });
export type StudentPhotoResultData = z.infer<typeof StudentPhotoResultSchema>;

// ---------------------------------------------------------------------------
// Badge (needs less than the full profile, so a librarian can print it)
// ---------------------------------------------------------------------------

export const StudentBadgeSchema = z.object({
  id: z.string(),
  paideonId: z.string(),
  cardNumber: z.string(),
  admissionNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  photoUrl: z.string().nullable(),
  grade: z.number().int(),
  section: z.string().nullable(),
  status: StudentStatusEnum,
});
export type StudentBadgeData = z.infer<typeof StudentBadgeSchema>;

export const StudentBadgeListSchema = z.array(StudentBadgeSchema);

export const MAX_BADGES_PER_PRINT = 100;

/** POST /api/people/students/badge-print: records that these badges were printed. */
export const BadgePrintSchema = z
  .object({
    studentIds: z
      .array(z.string().min(1))
      .min(1, 'Choose at least one student.')
      .max(
        MAX_BADGES_PER_PRINT,
        `Choose at most ${MAX_BADGES_PER_PRINT} students.`,
      ),
  })
  .strict();
export type BadgePrintData = z.infer<typeof BadgePrintSchema>;

// ---------------------------------------------------------------------------
// Assign class to several students
// ---------------------------------------------------------------------------

export const AssignClassSchema = z
  .object({
    studentIds: z
      .array(z.string().min(1))
      .min(1, 'Select at least one student.')
      .max(200, 'Select at most 200 students at a time.'),
    classId: z
      .string({ required_error: 'Choose a class.' })
      .min(1, 'Choose a class.'),
  })
  .strict();
export type AssignClassData = z.infer<typeof AssignClassSchema>;

export const AssignClassResultSchema = z.object({
  assigned: z.number().int().nonnegative(),
  skipped: z.array(z.object({ id: z.string(), reason: z.string() })),
});
export type AssignClassResultData = z.infer<typeof AssignClassResultSchema>;

export const ChangeStudentStatusResultSchema = z.object({
  status: StudentStatusEnum,
  /** Books still out; the person at the library desk should chase these. */
  activeLoans: z.number().int().nonnegative(),
});
export type ChangeStudentStatusResultData = z.infer<
  typeof ChangeStudentStatusResultSchema
>;
