// GET /api/people/students/:id/library: what a student has borrowed, for the
// Library tab on their profile.

import { z } from 'zod';
import { FineSchema } from './fine.ts';
import { LoanSummarySchema } from './loan.ts';

export const StudentLibrarySchema = z.object({
  /** Books out now. */
  current: z.array(LoanSummarySchema),
  /** The 20 most recent returned books. */
  history: z.array(LoanSummarySchema),
  fines: z.array(FineSchema),
});

export type StudentLibraryData = z.infer<typeof StudentLibrarySchema>;
