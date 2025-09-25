// packages/contracts/src/blocks/page-specific/crest-symbol.ts
// Defines the schema for crest-related symbol entries.

import { z } from 'zod';

import { CREST_SYMBOLS_BLOCK } from '../block-type.ts';

export const CrestSymbolSchema = z.object({
  id: z.string(),
  name: z.string(),
  meaning: z.string(),
  position: z.string().optional(),
});
export type CrestSymbol = z.infer<typeof CrestSymbolSchema>;

export const CrestSchema = z.object({
  blockType: z.literal(CREST_SYMBOLS_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  symbols: z.array(CrestSymbolSchema),
});
export type CrestData = z.infer<typeof CrestSchema>;
