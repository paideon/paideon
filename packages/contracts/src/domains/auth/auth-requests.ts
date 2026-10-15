// Request bodies of the auth endpoints (login, activation, password reset,
// two-factor). This file is the ONE place these rules are written:
//
//   - the API validates every incoming request with these schemas
//   - the portal forms can check the same schemas before sending
//
// Each schema is `.strict()`: a request carrying a field that is not listed
// here (e.g. { role: 'ADMIN' }) is rejected instead of silently ignored.
//
// `z.infer` gives the type AFTER the schema ran, so trimmed and lowercased
// values are what the API handlers and the services receive.

import { z } from 'zod';
import {
  EMAIL_MAX_LENGTH,
  LOGIN_PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_LENGTH,
} from '../../constants/index.ts';

const utf8 = new TextEncoder();

// ─────────────────────────────────────────────────────────────
// BUILDING BLOCKS
// ─────────────────────────────────────────────────────────────

// A string that gives ONE friendly message when the field is missing or is
// not a string (instead of "Required" / "Expected string, received number").
const requiredString = (message: string) =>
  z.string({ required_error: message, invalid_type_error: message });

// School email. Trimmed and lowercased so "John@School.lk " finds the
// same account as "john@school.lk".
const emailField = requiredString('Enter your email address.')
  .trim()
  .toLowerCase()
  .min(1, 'Enter your email address.')
  .max(
    EMAIL_MAX_LENGTH,
    `Email must be at most ${EMAIL_MAX_LENGTH} characters.`,
  )
  .email('Enter a valid email address.');

// Login identifier: a school email OR a Paideon ID (e.g. PAI-STU-0001).
// Emails are lowercased and IDs are uppercased to match how they are stored.
const identifierField = requiredString('Enter your email or Paideon ID.')
  .trim()
  .min(1, 'Enter your email or Paideon ID.')
  .max(EMAIL_MAX_LENGTH, 'Email or Paideon ID is too long.')
  .transform((value) =>
    value.includes('@') ? value.toLowerCase() : value.toUpperCase(),
  );

// A NEW password (activation and reset). Each rule has its own message so a
// form can tell the user exactly which one is missing.
const newPasswordField = requiredString('Enter a password.')
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/\d/, 'Password must contain a number.')
  .regex(
    /[!@#$%^&*_-]/,
    'Password must contain a special character (!@#$%^&*_-).',
  )
  .refine((value) => utf8.encode(value).length <= PASSWORD_MAX_BYTES, {
    message: `Password is too long (at most ${PASSWORD_MAX_BYTES} bytes; each Sinhala or Tamil letter counts as 3).`,
  });

// The one-time token from an activation or reset link. Only the shape is
// checked here. Whether it is real, expired or used is decided by the service.
const linkTokenField = requiredString('This link is missing its token.')
  .trim()
  .min(1, 'This link is missing its token.')
  .max(256, 'This link is invalid.');

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────

export const LoginRequestSchema = z
  .object({
    identifier: identifierField,
    password: requiredString('Enter your password.')
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      )
      .max(LOGIN_PASSWORD_MAX_LENGTH, 'Password is too long.'),
  })
  .strict();

export type LoginRequestData = z.infer<typeof LoginRequestSchema>;

// ─────────────────────────────────────────────────────────────
// POST /api/auth/activate
// ─────────────────────────────────────────────────────────────
// Step 1 of activation: the user asks for an activation link by email.

export const RequestActivationSchema = z
  .object({
    email: emailField,
  })
  .strict();

export type RequestActivationData = z.infer<typeof RequestActivationSchema>;

// ─────────────────────────────────────────────────────────────
// POST /api/auth/activate/confirm
// ─────────────────────────────────────────────────────────────
// Step 2 of activation: the user opened the link and chose a password.

export const ConfirmActivationSchema = z
  .object({
    token: linkTokenField,
    password: newPasswordField,
    confirmPassword: requiredString('Confirm your password.'),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type ConfirmActivationData = z.infer<typeof ConfirmActivationSchema>;

// ─────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────

export const ForgotPasswordSchema = z
  .object({
    email: emailField,
  })
  .strict();

export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

// ─────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────

export const ResetPasswordSchema = z
  .object({
    token: linkTokenField,
    newPassword: newPasswordField,
    confirmPassword: requiredString('Confirm your password.'),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

// ─────────────────────────────────────────────────────────────
// POST /api/auth/2fa/verify  (endpoint not built yet)
// ─────────────────────────────────────────────────────────────
// The 6-digit code from the authenticator app. Backup codes have a
// different format and will get their own schema.

export const TotpVerifySchema = z
  .object({
    code: requiredString('Enter the 6-digit code.')
      .trim()
      .regex(/^\d{6}$/, 'The code must be exactly 6 digits.'),
  })
  .strict();

export type TotpVerifyData = z.infer<typeof TotpVerifySchema>;
