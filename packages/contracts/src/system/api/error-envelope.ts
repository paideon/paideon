// packages/contracts/src/system/api/error-envelope.ts
//
// The standard API error shape (code, message, optional field errors).

import { z } from "zod";

export const ERROR_CODE_VALUES = [
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "CONFLICT",
  "INTERNAL_ERROR",
] as const;

export const ErrorCodeEnum = z.enum(ERROR_CODE_VALUES);

export type ErrorCodeEnumData = z.infer<typeof ErrorCodeEnum>;

export const ErrorEnvelopeSchema = z.object({
  code: ErrorCodeEnum,
  message: z.string(),
  fieldErrors: z.record(z.string(), z.string()).optional(),
});

export type ErrorEnvelopeData = z.infer<typeof ErrorEnvelopeSchema>;
