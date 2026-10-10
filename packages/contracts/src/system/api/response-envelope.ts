// packages/contracts/src/system/api/response-envelope.ts

import { z } from 'zod';

import { ErrorEnvelopeSchema } from './error-envelope.ts';
import { PaginationMetaSchema } from '../../primitives/pagination.ts';

export const ResponseEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ErrorEnvelopeSchema.optional(),
  });

export type ResponseEnvelopeData<T> = {
  success: boolean;
  data?: T;
  error?: z.infer<typeof ErrorEnvelopeSchema>;
};

export const PaginatedResponseEnvelopeSchema = <T extends z.ZodType>(
  itemSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: z
      .object({
        items: z.array(itemSchema),
        meta: PaginationMetaSchema,
      })
      .optional(),
    error: ErrorEnvelopeSchema.optional(),
  });

export type PaginatedResponseEnvelopeData<T> = {
  success: boolean;
  data?: {
    items: T[];
    meta: z.infer<typeof PaginationMetaSchema>;
  };
  error?: z.infer<typeof ErrorEnvelopeSchema>;
};
