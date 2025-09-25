// packages/contracts/src/primitieves/seo.ts

// SEO metadata contract attached to every public page.
//
// Should contain:
//   SeoSchema       — title, description, canonical?, ogImage? (R2 key),
//                     ogTitle?, ogDescription?, noIndex?: boolean,
//                     structuredData? (JSON-LD object)
//   SeoData         — z.infer<typeof SeoSchema>
//   OpenGraphSchema — subset: ogTitle, ogDescription, ogImage
//
// Notes:
//   The web app's generateMetadata() in each page.tsx maps SeoData to
//   Next.js Metadata format. Keep fields aligned with Next.js Metadata type.

import { z } from 'zod';

export const OpenGraphSchema = z.object({
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

export const SeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  canonical: z.string().url().optional(),
  ogImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  noIndex: z.boolean().optional(),
  structuredData: z.record(z.string(), z.unknown()).optional(),
});

export type OpenGraphData = z.infer<typeof OpenGraphSchema>;
export type SeoData = z.infer<typeof SeoSchema>;
