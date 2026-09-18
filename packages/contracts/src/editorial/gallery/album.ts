// packages/contracts/src/editorial/gallery/album.ts
//
// Task 7.7/F-168 (Gallery Module): the full, persisted `GalleryAlbum`
// entity lives as Zod I/O schemas in
// packages/api/src/modules/gallery/validators.ts — the same layering
// established for News/Events/Societies (see events/event.ts's header
// comment for the fullest explanation). What survives here is only
// `GalleryAlbumCardSchema` — the projection @paideon/ui's GalleryAlbumCard
// actually renders directly.
//
// One deliberate divergence from the old, now-relocated entity schema:
// this task's own spec (Engineering Roadmap Task 7.7's field table,
// F-151 "Albums sorted by year") asks for a plain `year`, not a full
// ISO `date` — the new `GalleryAlbumCreateInput`/`Output` in the API
// layer stores `year: number` accordingly, not the old schema's
// `date: string`.

import { z } from "zod";

export const GALLERY_ALBUM_CONTENT_TYPE = "gallery-album";

// Card projection — matches @paideon/ui's GalleryAlbumCardProps exactly.
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
