// packages/contracts/src/features/results/al.ts

import { z } from 'zod';

import { ALStreamEnum } from '../academics/al-stream.ts';

export const ALGradeEnum = z.enum(['A', 'B', 'C', 'S', 'F', 'AB']);

export const ALStreamResultSchema = z.object({
  stream: ALStreamEnum,
  totalSitting: z.number().int().nonnegative(),
  totalPassed: z.number().int().nonnegative(),
  districtRanks: z.number().int().nonnegative().optional(),
  islandRanks: z.number().int().nonnegative().optional(),
});

export const ALResultSchema = z.object({
  year: z.string().min(1),
  results: z.array(ALStreamResultSchema),
  totalUniversityQualified: z.number().int().nonnegative().optional(),
});

export type ALGradeEnumData = z.infer<typeof ALGradeEnum>;
export type ALStreamResultData = z.infer<typeof ALStreamResultSchema>;
export type ALResultData = z.infer<typeof ALResultSchema>;
