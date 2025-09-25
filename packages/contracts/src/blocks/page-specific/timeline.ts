// packages/contracts/src/blocks/page-specific/timeline.ts
// Defines the schema for timeline blocks and their entries.

import { z } from 'zod';

import { TIMELINE_BLOCK } from '../block-type.js';

export const TimelineItemSchema = z.object({
  id: z.string(),
  year: z.string(),
  title: z.string(),
  description: z.string(),
  era: z.enum(['early', 'mid', 'modern']).optional(),
});
export type TimelineItem = z.infer<typeof TimelineItemSchema>;

export const TimelineSchema = z.object({
  blockType: z.literal(TIMELINE_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(TimelineItemSchema),
});
export type TimelineData = z.infer<typeof TimelineSchema>;
