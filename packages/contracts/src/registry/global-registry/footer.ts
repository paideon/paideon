import { z } from 'zod';

import type { PageSection } from '../types.ts';

// ─── Schemas ────────────────────────────────────────────────────────────────

export const FooterLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});
export type FooterLinkData = z.infer<typeof FooterLinkSchema>;

export const FooterColumnSchema = z.object({
  id: z.string(),
  heading: z.string(),
  links: z.array(FooterLinkSchema),
});
export type FooterColumnData = z.infer<typeof FooterColumnSchema>;

export const FooterSocialLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  icon: z.enum(['facebook', 'instagram', 'youtube', 'github', 'linkedin']),
});
export type FooterSocialLinkData = z.infer<typeof FooterSocialLinkSchema>;

export const FooterContactLineSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
});
export type FooterContactLineData = z.infer<typeof FooterContactLineSchema>;

export const FooterContactSchema = z.object({
  title: z.string(),
  lines: z.array(FooterContactLineSchema),
});
export type FooterContactData = z.infer<typeof FooterContactSchema>;

export const FooterContentSchema = z.object({
  schoolName: z.string(),
  tagline: z.string().optional(),
  contact: FooterContactSchema,
  columns: z.array(FooterColumnSchema),
  socialLinks: z.array(FooterSocialLinkSchema).optional(),
  copyright: z.string().optional(),
  legalLinks: z.array(FooterLinkSchema).optional(),
});
export type FooterContentData = z.infer<typeof FooterContentSchema>;

export const footerSection: PageSection = {
  key: 'global.footer',
  blockKey: 'footer',
  label: 'Footer',
  description:
    'School name, tagline, contact block, link columns, social links, and copyright line shown on every page.',
  schema: FooterContentSchema,
};
