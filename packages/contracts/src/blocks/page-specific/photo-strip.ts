// packages/contracts/src/blocks/page-specific/photo-strip.ts
// Defines the schema for photo-strip blocks and their image items.

import { z } from 'zod';

import { PHOTO_STRIP_BLOCK } from '../block-type.js';

export const PhotoStripItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const PhotoStripSchema = z.object({
  blockType: z.literal(PHOTO_STRIP_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  photos: z.array(PhotoStripItemSchema),
});

export type PhotoStripData = z.infer<typeof PhotoStripSchema>;
