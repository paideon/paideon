import { z } from 'zod';

export const CrestSymbolSchema = z.object({
  id: z.string(),
  name: z.string(),
  meaning: z.string(),
  position: z.string().optional(),
});

export type CrestSymbolData = z.infer<typeof CrestSymbolSchema>;
