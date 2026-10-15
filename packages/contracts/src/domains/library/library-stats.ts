// Headline library figures shown on the portal landing page.

import { z } from 'zod';

export const LibraryStatsSchema = z.object({
  students: z.number().int().nonnegative(),
  teachers: z.number().int().nonnegative(),
  staff: z.number().int().nonnegative(),
  books: z.number().int().nonnegative(),
});

export type LibraryStatsData = z.infer<typeof LibraryStatsSchema>;

// Shown when live figures are unavailable.
export const LIBRARY_STATS_FALLBACK: LibraryStatsData = {
  students: 4198,
  teachers: 188,
  staff: 77,
  books: 8500,
};
