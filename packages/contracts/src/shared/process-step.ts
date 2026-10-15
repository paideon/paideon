import { z } from 'zod';

export const ProcessStepSchema = z.object({
  id: z.string(),
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export type ProcessStepData = z.infer<typeof ProcessStepSchema>;
