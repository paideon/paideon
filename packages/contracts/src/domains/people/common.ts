// Small shared pieces for people records.

import { z } from 'zod';

export const GENDER_VALUES = ['MALE', 'FEMALE'] as const;
export const GenderEnum = z.enum(GENDER_VALUES);
export type GenderEnumData = z.infer<typeof GenderEnum>;

export const MEDIUM_VALUES = ['SINHALA', 'TAMIL', 'ENGLISH'] as const;
export const MediumEnum = z.enum(MEDIUM_VALUES);
export type MediumEnumData = z.infer<typeof MediumEnum>;

export const LOCAL_NAME_LANGUAGE_VALUES = ['SINHALA', 'TAMIL'] as const;
export const LocalNameLanguageEnum = z.enum(LOCAL_NAME_LANGUAGE_VALUES);
export type LocalNameLanguageEnumData = z.infer<typeof LocalNameLanguageEnum>;

/** Stored in religion / ethnicity when the family chose not to say. */
export const PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY';

/** Text shown for the stored value (null means nothing was recorded). */
export function describeOptionalChoice(value: string | null): string {
  if (value === null || value === '') return 'Not recorded';
  if (value === PREFER_NOT_TO_SAY) return 'Prefer not to say';
  return value;
}

/** Religion and ethnicity: optional free text, or PREFER_NOT_TO_SAY. */
export const optionalChoiceSchema = z
  .string({ invalid_type_error: 'Enter text.' })
  .trim()
  .max(60, 'Must be at most 60 characters.')
  .nullish()
  .transform((value) =>
    value === undefined || value === null || value === '' ? null : value,
  );

/**
 * Sri Lankan phone numbers. Accepts +94 7x xxx xxxx, 07x xxx xxxx and the
 * 0094 form, with spaces, dashes and brackets, and returns the +947xxxxxxxx
 * form so the same number is never stored two ways. Landlines (e.g. 011...)
 * are accepted too: +94 followed by 9 digits.
 */
export function normaliseSriLankanPhone(input: string): string | null {
  const digits = input.replace(/[\s()-]/g, '');
  if (!/^(\+|00)?[0-9]+$/.test(digits)) return null;
  let national: string;
  if (digits.startsWith('+94')) national = digits.slice(3);
  else if (digits.startsWith('0094')) national = digits.slice(4);
  else if (digits.startsWith('94') && digits.length === 11)
    national = digits.slice(2);
  else if (digits.startsWith('0')) national = digits.slice(1);
  else return null;
  return /^[1-9][0-9]{8}$/.test(national) ? `+94${national}` : null;
}

export const SriLankanPhoneSchema = z
  .string({ required_error: 'Enter a phone number.' })
  .trim()
  .min(1, 'Enter a phone number.')
  .transform((value, ctx) => {
    const normalised = normaliseSriLankanPhone(value);
    if (normalised === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a phone number like 077 123 4567 or +94 77 123 4567.',
      });
      return z.NEVER;
    }
    return normalised;
  });

/** A calendar date as YYYY-MM-DD (what <input type="date"> sends). */
export const DateOnlySchema = z
  .string({ required_error: 'Enter a date.' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a date.')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, 'Enter a real date.');

export const NameSchema = (label: string) =>
  z
    .string({ required_error: `Enter ${label}.` })
    .trim()
    .min(1, `Enter ${label}.`)
    .max(
      80,
      `${label[0].toUpperCase()}${label.slice(1)} must be at most 80 characters.`,
    );

const optionalName = (max: number, tooLong: string) =>
  z
    .string()
    .trim()
    .max(max, tooLong)
    .nullish()
    .transform((value) => (value ? value : null));

export const OptionalTextSchema = optionalName;
