// packages/contracts/src/blocks/generic/stats.ts
// Defines the schema for statistics blocks and their metric items.

import { z } from 'zod';

import { STATS_BLOCK } from '../block-type.js';

export const TrendDirectionEnum = z.enum(['up', 'down', 'neutral']);

export const StatCardVariantEnum = z.enum(['single', 'with-trend']);

export const TrendPropsSchema = z.object({
  direction: TrendDirectionEnum,
  value: z.string(),
  label: z.string().optional(),
});

export const StatItemSchema = z.object({
  id: z.string(),
  target: z.number(),
  label: z.string(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  description: z.string().optional(),
  tooltip: z
    .object({
      content: z.string(),
      position: z.enum(['top', 'bottom', 'left', 'right']).optional(),
    })
    .optional(),
  disableCountUp: z.boolean().optional(),
  trend: TrendPropsSchema.optional(),
});

export const StatsSchema = z.object({
  blockType: z.literal(STATS_BLOCK),
  stats: z.array(StatItemSchema),
});

export type StatsData = z.infer<typeof StatsSchema>;
export type StatItem = z.infer<typeof StatItemSchema>;
export type StatData = StatItem;
export type TrendDirectionType = z.infer<typeof TrendDirectionEnum>;
export type StatCardVariantType = z.infer<typeof StatCardVariantEnum>;
