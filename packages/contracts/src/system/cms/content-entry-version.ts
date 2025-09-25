// packages/contracts/src/system/cms/content-entry-version.ts
//
// A single version-history row for a content entry.

import { z } from 'zod';

export const ContentEntryVersionSchema = z.object({
  id: z.string(),
  contentEntryId: z.string(),
  version: z.number(),
  data: z.unknown(), // The snapshot of the content at this version
  changedBy: z.string(),
  changedAt: z.string(),
  changeReason: z.string().optional(),
});

export type ContentEntryVersionData = z.infer<typeof ContentEntryVersionSchema>;
