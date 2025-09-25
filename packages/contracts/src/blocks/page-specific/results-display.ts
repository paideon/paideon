// packages/contracts/src/blocks/page-specific/results-display.ts
// Defines the schema for academic results display blocks.

import { z } from 'zod';

import { RESULTS_DISPLAY_BLOCK } from '../block-type.js';

export const ResultsSummarySchema = z.object({
  examType: z.enum(['OL', 'AL']),
  year: z.string(),
  heading: z.string().optional(),
  highlights: z.array(z.string()),
  downloadHref: z.string().optional(),
});

export const ResultsDisplaySchema = z.object({
  blockType: z.literal(RESULTS_DISPLAY_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  summaries: z.array(ResultsSummarySchema),
});

export type ResultsDisplayData = z.infer<typeof ResultsDisplaySchema>;
