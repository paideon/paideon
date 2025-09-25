// packages/contracts/src/blocks/generic/downloads.ts
// Defines the schema for downloadable content lists and their items.

import { z } from 'zod';

import { DOWNLOADS_BLOCK } from '../block-type.js';

export const DownloadItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  href: z.string(),
  fileType: z.enum(['PDF', 'DOCX', 'XLSX', 'PPT', 'ZIP']).optional(),
  fileSize: z.string().optional(),
});

export const DownloadsSchema = z.object({
  blockType: z.literal(DOWNLOADS_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(DownloadItemSchema),
});

export type DownloadsData = z.infer<typeof DownloadsSchema>;
export type DownloadItem = z.infer<typeof DownloadItemSchema>;
