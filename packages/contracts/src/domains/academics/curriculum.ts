// packages/contracts/src/features/academics/curriculum.ts

// High-level curriculum overview contracts.

import { z } from 'zod';

import { ALStreamSchema } from './al-stream.ts';

export const CurriculumLevelEnum = z.enum(['OL', 'AL']);

export const SyllabusSchema = z.object({
  level: CurriculumLevelEnum,
  subject: z.string().min(1),
  board: z.string().default('NIE'),
  year: z.string().min(1),
});

export const CurriculumSchema = z.object({
  level: CurriculumLevelEnum,
  streams: z.array(ALStreamSchema).optional(),
  subjects: z.array(SyllabusSchema),
});

export type CurriculumLevelEnumData = z.infer<typeof CurriculumLevelEnum>;
export type SyllabusData = z.infer<typeof SyllabusSchema>;
export type CurriculumData = z.infer<typeof CurriculumSchema>;
