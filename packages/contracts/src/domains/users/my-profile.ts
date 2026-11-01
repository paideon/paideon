// GET /api/me/profile and PATCH /api/me/contact: a person's own record.

import { z } from 'zod';
import { RoleEnum } from './role.ts';

export const MyProfileSchema = z.object({
  id: z.string(),
  paideonId: z.string(),
  /** Library card number (printed as the barcode on the ID badge). */
  cardNumber: z.string(),
  role: RoleEnum,
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  email: z.string(),
  photoUrl: z.string().nullable(),

  // Editable by the person (see UpdateMyContactSchema).
  phone: z.string().nullable(),
  address: z.string().nullable(),
  /** False for accounts with no profile row to keep an address on (admin, librarian). */
  addressEditable: z.boolean(),

  // Read-only school data. Which of these are filled depends on the role.
  grade: z.number().int().nullable(),
  section: z.string().nullable(),
  admissionNumber: z.string().nullable(),
  employeeId: z.string().nullable(),
  designation: z.string().nullable(),
});

export type MyProfileData = z.infer<typeof MyProfileSchema>;

const optionalText = (max: number, tooLong: string) =>
  z
    .string({ invalid_type_error: 'Enter text.' })
    .trim()
    .max(max, tooLong)
    .transform((value) => (value === '' ? null : value));

// Digits with an optional leading +, spaces, dashes and brackets: "+94 77 123 4567", "077-1234567".
const PHONE_PATTERN = /^\+?[0-9 ()-]+$/;

export const UpdateMyContactSchema = z
  .object({
    phone: optionalText(20, 'Phone number is too long.').refine(
      (value) =>
        value === null ||
        (PHONE_PATTERN.test(value) && value.replace(/\D/g, '').length >= 7),
      { message: 'Enter a valid phone number.' },
    ),
    address: optionalText(300, 'Address must be at most 300 characters.'),
  })
  .strict();

export type UpdateMyContactData = z.infer<typeof UpdateMyContactSchema>;
