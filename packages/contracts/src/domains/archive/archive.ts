// packages/contracts/src/domains/archive/archive.ts
//
// Digital Archive contract (Task 7.20, F-155/F-182).
//
// ArchiveSchema — the full entity: id, title, year, category, description, file
// ArchiveCardSchema — lighter projection for grid display
//
// Categories: photograph, magazine, prize-giving record, prefect list
// Files uploaded through Media Library pipeline (R2 CDN URLs)

import { z } from "zod";

import {
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../../constants/index.ts";
import { ImageSchema } from "../../primitives/index.ts";

export const ArchiveCategory = z.enum([
  "photograph",
  "magazine",
  "prize_giving_record",
  "prefect_list",
]);

// Display labels for UI components
export const ARCHIVE_CATEGORY_LABELS: Record<
  z.infer<typeof ArchiveCategory>,
  string
> = {
  photograph: "Photograph",
  magazine: "Magazine",
  prize_giving_record: "Prize Giving Record",
  prefect_list: "Prefect List",
};

// The full entity — admin CRUD and database storage.
export const ArchiveSchema = z.object({
  id: z.string(),
  title: z.string().max(MAX_TITLE_LENGTH),
  year: z.string(), // e.g. "1987"
  category: ArchiveCategory,
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  file: ImageSchema, // R2 CDN URL from Media Library
});

export type ArchiveData = z.infer<typeof ArchiveSchema>;
export type ArchiveCategoryData = z.infer<typeof ArchiveCategory>;

// Input schema for create/update operations.
export const ArchiveInputSchema = z.object({
  title: z.string().min(1).max(MAX_TITLE_LENGTH),
  year: z.string().min(1),
  category: ArchiveCategory,
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  file: ImageSchema,
});

export const ArchiveUpdateSchema = ArchiveInputSchema.partial().extend({
  id: z.string().min(1),
});

export type ArchiveInput = z.infer<typeof ArchiveInputSchema>;
export type ArchiveUpdate = z.infer<typeof ArchiveUpdateSchema>;

// Output schema with serialized file (from flattened storage).
export const ArchiveOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  category: ArchiveCategory,
  description: z.string().nullable(),
  file: ImageSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ArchiveOutput = z.infer<typeof ArchiveOutputSchema>;

// Card projection — lighter display for grid.
export const ArchiveCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  category: z.string(),
  fileSrc: z.string(),
  fileAlt: z.string(),
});

export type ArchiveCardData = z.infer<typeof ArchiveCardSchema>;

// Helper function to convert ArchiveOutput to ArchiveCardData
export function toArchiveCardData(archive: ArchiveOutput): ArchiveCardData {
  return {
    id: archive.id,
    title: archive.title,
    year: archive.year,
    // Was the raw enum value ('prize_giving_record') reaching ArchiveCard
    // directly — every caller of this helper gets the fix for free.
    category: ARCHIVE_CATEGORY_LABELS[archive.category],
    fileSrc: archive.file.src,
    fileAlt: archive.file.alt,
  };
}
