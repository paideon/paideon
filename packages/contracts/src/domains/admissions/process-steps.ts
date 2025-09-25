// packages/contracts/src/features/admissions/process.ts

import { z } from 'zod';

export const AdmissionsStepSchema = z.object({
  id: z.string().min(1),
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  requiredDocuments: z.array(z.string()).optional(),
  estimatedDays: z.number().int().positive().optional(),
});

export const AdmissionsProcessSchema = z.object({
  steps: z.array(AdmissionsStepSchema),
  notes: z.string().optional(),
});

export type AdmissionsStepData = z.infer<typeof AdmissionsStepSchema>;
export type AdmissionsProcessData = z.infer<typeof AdmissionsProcessSchema>;
