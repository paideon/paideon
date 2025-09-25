// packages/contracts/src/blocks/page-specific/key-dates.ts
// Defines the schema for key-date timeline entries.

import { z } from 'zod';

import { KEY_DATES_BLOCK } from '../block-type.js';

export const KeyDateSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const KeyDatesSchema = z.object({
  blockType: z.literal(KEY_DATES_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  dates: z.array(KeyDateSchema),
});

export type KeyDatesData = z.infer<typeof KeyDatesSchema>;
