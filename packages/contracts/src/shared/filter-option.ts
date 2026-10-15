import { z } from 'zod';

export const FilterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  count: z.number().optional(),
});

export type FilterOptionData = z.infer<typeof FilterOptionSchema>;
