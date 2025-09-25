// packages/contracts/src/blocks/page-specific/process-steps.ts
// Defines the schema for process-step blocks.

import { z } from 'zod';

import { PROCESS_STEPS_BLOCK } from '../block-type.js';

export const ProcessStepSchema = z.object({
  id: z.string(),
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const ProcessStepsSchema = z.object({
  blockType: z.literal(PROCESS_STEPS_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  steps: z.array(ProcessStepSchema),
});

export type ProcessStepsData = z.infer<typeof ProcessStepsSchema>;
