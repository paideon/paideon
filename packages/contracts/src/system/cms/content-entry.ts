// packages/contracts/src/system/cms/content-entry.ts
//
// Runtime shape of a ContentEntry row as it exists in the database.
// Defined here so non-database packages can reference the shape
// without importing @paideon/db.
//
// Should contain:
//   ContentEntrySchema — id, sectionKey, scope, locale, contentType,
//                        data (unknown), createdAt, updatedAt, publishedAt?
//   ContentEntryData   — z.infer type
//
// Notes:
//   Keep this in sync with packages/database/prisma/schema.prisma.
//   When the Prisma schema changes, update this file too.

import { z } from "zod";

import { PublishStatusEnum } from "../../primitives/enums/publish-status.ts";

export const ContentEntrySchema = z.object({
  id: z.string(),
  sectionKey: z.string(),
  scope: z.string(),
  locale: z.string(),
  contentType: z.string(),
  data: z.unknown(),
  createdAt: z.string(),
  status: PublishStatusEnum,
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
});

export type ContentEntryData = z.infer<typeof ContentEntrySchema>;
