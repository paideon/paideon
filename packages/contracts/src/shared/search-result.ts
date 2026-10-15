import { z } from 'zod';

export const SearchResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  meta: z.string().optional(),
  href: z.string(),
});

export type SearchResultData = z.infer<typeof SearchResultSchema>;
