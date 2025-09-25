// packages/contracts/src/domains/academics/al-stream.ts

// A/L academic stream definitions for KCC.

import { z } from 'zod';

export const ALStreamEnum = z.enum([
  'physical-science',
  'bio-science',
  'commerce',
  'arts',
  'technology',
]);

export const ALStreamSchema = z.object({
  key: ALStreamEnum,
  name: z.string().min(1),
  description: z.string().optional(),
  subjects: z.array(z.string()),
  careerPaths: z.array(z.string()).optional(),
  icon: z.string().optional(),
});

export type ALStreamEnumData = z.infer<typeof ALStreamEnum>;
export type ALStreamData = z.infer<typeof ALStreamSchema>;
