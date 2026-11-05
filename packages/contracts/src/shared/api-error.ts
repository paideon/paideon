// The shape of an error body from the API, so forms can show field errors.

import { z } from 'zod';

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  /** Machine-readable reason, e.g. 'ADMISSION_NUMBER_TAKEN'. */
  code: z.string().optional(),
  /** Field name to message, for errors that belong to one form field. */
  fieldErrors: z.record(z.string(), z.string()).optional(),
});

export type ApiErrorData = z.infer<typeof ApiErrorSchema>;
