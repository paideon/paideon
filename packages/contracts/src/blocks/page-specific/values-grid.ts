// packages/contracts/src/blocks/page-specific/values-grid.ts
// Defines the schema for values-grid blocks and their value items.

import { z } from 'zod';

import { VALUES_GRID_BLOCK } from '../block-type.js';

export const ValueItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});
export type ValueItem = z.infer<typeof ValueItemSchema>;

export const ValuesSchema = z.object({
  blockType: z.literal(VALUES_GRID_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  values: z.array(ValueItemSchema),
});
export type ValuesData = z.infer<typeof ValuesSchema>;
