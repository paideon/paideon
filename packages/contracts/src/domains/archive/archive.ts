import { z } from 'zod';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../constants/index.ts';
import { ImageSchema } from '../../primitives/index.ts';

export const ArchiveCategory = z.enum([
  'photograph',
  'magazine',
  'prize_giving_record',
  'prefect_list',
]);

export type ArchiveCategoryData = z.infer<typeof ArchiveCategory>;

// Display labels, so UI never shows the raw enum value.
export const ARCHIVE_CATEGORY_LABELS: Record<ArchiveCategoryData, string> = {
  photograph: 'Photograph',
  magazine: 'Magazine',
  prize_giving_record: 'Prize Giving Record',
  prefect_list: 'Prefect List',
};

export const ArchiveSchema = z.object({
  id: z.string(),
  title: z.string().max(MAX_TITLE_LENGTH),
  year: z.string(), // e.g. "1987"
  category: ArchiveCategory,
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  file: ImageSchema, // R2 key from the Media Library
});

// Lighter projection for grid display.
export const ArchiveCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  category: z.string(),
  fileSrc: z.string(),
  fileAlt: z.string(),
});

export type ArchiveData = z.infer<typeof ArchiveSchema>;
export type ArchiveCardData = z.infer<typeof ArchiveCardSchema>;

export function toArchiveCardData(archive: ArchiveData): ArchiveCardData {
  return {
    id: archive.id,
    title: archive.title,
    year: archive.year,
    category: ARCHIVE_CATEGORY_LABELS[archive.category],
    fileSrc: archive.file.src,
    fileAlt: archive.file.alt,
  };
}
