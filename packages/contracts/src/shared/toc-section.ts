// packages/contracts/src/content/toc-section.ts

import { z } from 'zod';

export const TocSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export type TocSectionData = z.infer<typeof TocSectionSchema>;
