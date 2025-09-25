// packages/contracts/src/content/search.ts

// Search result contract.
//
// Should contain:
//   SearchResultSchema — id, label, meta?, href
//   SearchResultData   — z.infer type

import { z } from 'zod';

export const SearchResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  meta: z.string().optional(),
  href: z.string(),
});

export type SearchResultData = z.infer<typeof SearchResultSchema>;
