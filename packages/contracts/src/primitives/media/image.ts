// Shared image contracts.
//
// `src` is an R2 object key, never a full CDN URL, so keys stay portable if
// the CDN domain changes. Consumers resolve keys to URLs at render time.

import { z } from 'zod';

export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().optional(),
});

// Person thumbnails: source and alt text only.
export const AvatarSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export type ImageData = z.infer<typeof ImageSchema>;
export type AvatarData = z.infer<typeof AvatarSchema>;
