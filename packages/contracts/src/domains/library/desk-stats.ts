// Today's numbers for the library desk, from GET /api/library/reports/stats.
// (LibraryStatsSchema in library-stats.ts is a different thing: the headline
// school figures for the public landing page.)

import { z } from 'zod';

export const LibraryDeskStatsSchema = z.object({
  books: z.number().int().nonnegative(),
  copies: z.number().int().nonnegative(),
  activeLoans: z.number().int().nonnegative(),
  overdueCount: z.number().int().nonnegative(),
  loansToday: z.number().int().nonnegative(),
  returnsToday: z.number().int().nonnegative(),
});

export type LibraryDeskStatsData = z.infer<typeof LibraryDeskStatsSchema>;
