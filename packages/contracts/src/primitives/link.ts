// packages/contracts/src/primitieves/link.ts
//
// Shared link contracts for navigation, CTAs, and inline links.
//
// Should contain:
//   InternalLinkSchema  — { type: 'internal', href: string (relative), label: string }
//   ExternalLinkSchema  — { type: 'external', href: string (absolute URL),
//                           label: string, openInNewTab?: boolean }
//   LinkSchema          — z.discriminatedUnion('type', [InternalLink, ExternalLink])
//   LinkData            — z.infer<typeof LinkSchema>
//
// Used by:
//   blocks/cta.ts              — primary and secondary button links
//   blocks/downloads.ts        — downloadable document hrefs
//   registry/globals/navigation.ts — nav link hrefs

import { z } from 'zod';

import { LinkTargetEnum } from './enums/link-target.js';

export const InternalLinkSchema = z.object({
  type: z.literal('internal'),
  href: z.string().min(1),
  label: z.string().min(1),
});

export const ExternalLinkSchema = z.object({
  type: z.literal('external'),
  href: z.string().url(),
  label: z.string().min(1),
  openIn: LinkTargetEnum.default('self'),
});

export const LinkSchema = z.discriminatedUnion('type', [
  InternalLinkSchema,
  ExternalLinkSchema,
]);

export type InternalLinkData = z.infer<typeof InternalLinkSchema>;
export type ExternalLinkData = z.infer<typeof ExternalLinkSchema>;
export type LinkData = z.infer<typeof LinkSchema>;
