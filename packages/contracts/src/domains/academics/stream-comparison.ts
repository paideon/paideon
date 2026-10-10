// packages/contracts/src/domains/academics/stream-comparison.ts

// Comparison data between AL streams for academic guidance.

import { z } from 'zod';

export const StreamComparisonSchema = z.object({
  stream1: z.string(),
  stream2: z.string(),
  subjectOverlap: z.array(z.string()),
  subjectDifferences: z.array(
    z.object({
      subject: z.string(),
      inStream1: z.boolean(),
      inStream2: z.boolean(),
    }),
  ),
  recommendedFor: z.string().optional(),
});

export type StreamComparisonData = z.infer<typeof StreamComparisonSchema>;
