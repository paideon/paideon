import { z } from 'zod';

// Card projection, matching GalleryAlbumCardProps in @paideon/ui.
export const GalleryAlbumCardSchema = z.object({
  title: z.string(),
  year: z.string(),
  photoCount: z.number(),
  category: z.string().optional(),
  href: z.string(),
  coverSrc: z.string().optional(),
  coverAlt: z.string().optional(),
});

export type GalleryAlbumCardData = z.infer<typeof GalleryAlbumCardSchema>;
