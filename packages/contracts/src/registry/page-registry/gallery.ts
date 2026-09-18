// packages/contracts/src/registry/page-registry/gallery.ts
//
// Page registry for: Gallery. `gallery.hero` and `gallery.video` survive
// as registry sections — the video section is a genuinely optional,
// static-config embed with no domain model behind it (this file's own
// original note already said as much). `gallery.albums` is removed as of
// Task 7.7/F-168 — same precedent as registry/page-registry/news.ts's/
// events.ts's/societies.ts's own notes: it was a ContentEntry placeholder
// (an editor hand-pasting an `albums: GalleryAlbumCardSchema[]` array
// into a generic block section) authored while GalleryAlbum was still a
// deferred domain model (F-057). Now that `GalleryAlbum`/`GalleryPhoto`
// are real (schema.prisma) and `galleryRouter` is mounted, the albums
// grid is populated live via `gallery.list`, not from a ContentEntry row.

import { z } from "zod";

import { HeroSchema } from "../../blocks/index.ts";
import type { PageRegistry } from "../types.ts";

export const GalleryHeroSchema = HeroSchema;

export const GalleryVideoSectionSchema = z.object({
  heading: z.string().optional(),
  youtubePlaylistUrl: z.string(),
});
export type GalleryVideoSectionData = z.infer<typeof GalleryVideoSectionSchema>;

export const galleryRegistry: PageRegistry = {
  page: "gallery",
  scope: "page:gallery",
  label: "Gallery",
  description:
    "Manage the Gallery page hero and the optional video section. The albums grid is populated automatically from the Gallery module — manage those under Gallery, not here.",
  sections: [
    {
      key: "gallery.hero",
      blockKey: "hero",
      label: "Hero Banner",
      description: "Top-of-page headline and eyebrow text.",
      schema: GalleryHeroSchema,
    },
    {
      key: "gallery.video",
      blockKey: "rich-text-block",
      label: "Video Section",
      description: "Optional YouTube playlist embed of school event videos.",
      schema: GalleryVideoSectionSchema,
    },
  ],
};
