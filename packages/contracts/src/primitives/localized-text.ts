// packages/contracts/src/primitives/localized-text.ts

// Field-level locale scoping for short translatable strings.

import { z } from 'zod';

export const LocalizedTextSchema = z.object({
  en: z.string().min(1),
  si: z.string().min(1),
  ta: z.string().min(1),
});
export type LocalizedTextData = z.infer<typeof LocalizedTextSchema>;
