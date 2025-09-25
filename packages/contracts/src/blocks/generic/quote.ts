// packages/contracts/src/blocks/generic/quote.ts
// Defines the validated data shape for quote blocks.

import { z } from 'zod';

import { QUOTE_BLOCK } from '../block-type.js';

export const QuoteSchema = z.object({
  blockType: z.literal(QUOTE_BLOCK),
  eyebrow: z.string().optional(),
  quote: z.string(),
  attribution: z.string().optional(),
});
export type QuoteData = z.infer<typeof QuoteSchema>;
