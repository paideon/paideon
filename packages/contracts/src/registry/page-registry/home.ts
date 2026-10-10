// packages/contracts/src/registry/page-registry/home.ts
//
// Page registry for: Homepage (docs/Design System/Page Specifications.md
// section 01). Footer isn't a section here — it's a global section, see
// registry/global-registry/footer.ts.

import { z } from 'zod';

import { HeroSchema, StatsSchema } from '../../blocks/index.ts';
import { ALStreamSchema } from '../../domains/academics/al-stream.ts';
import { FacilityCardSchema } from '../../domains/facilities/facility-profile.ts';
import { StaffSchema } from '../../domains/people/staff-member.ts';
import { SocietyCardSchema } from '../../domains/societies/society-profile.ts';
import { TickerSchema } from '../../editorial/achievements/ticker-config.ts';
import { ArticleCardSchema } from '../../editorial/news/article.ts';
import type { PageRegistry } from '../types.ts';

export const HomeHeroSchema = HeroSchema;

export const HomeStatsSchema = StatsSchema;

export const HomePrincipalSchema = z.object({
  principal: StaffSchema,
  messageLinkHref: z.string().optional(),
});
export type HomePrincipalData = z.infer<typeof HomePrincipalSchema>;

export const HomeNewsSchema = z.object({
  articles: z.array(ArticleCardSchema).max(3),
});
export type HomeNewsData = z.infer<typeof HomeNewsSchema>;

export const HomeAcademicStreamsSchema = z.object({
  streams: z.array(ALStreamSchema),
});
export type HomeAcademicStreamsData = z.infer<typeof HomeAcademicStreamsSchema>;

export const HomeLifeAtKCCSchema = z.object({
  heading: z.string().optional(),
  photos: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }),
  ),
});
export type HomeLifeAtKCCData = z.infer<typeof HomeLifeAtKCCSchema>;

export const HomeCampusShowcaseSchema = z.object({
  heading: z.string().optional(),
  facilities: z.array(FacilityCardSchema),
});
export type HomeCampusShowcaseData = z.infer<typeof HomeCampusShowcaseSchema>;

export const HomeAchievementsSchema = TickerSchema;

export const HomeSocietiesSchema = z.object({
  heading: z.string().optional(),
  societies: z.array(SocietyCardSchema).max(4),
});
export type HomeSocietiesData = z.infer<typeof HomeSocietiesSchema>;

export const homeRegistry: PageRegistry = {
  page: 'home',
  scope: 'page:home',
  label: 'Homepage',
  description:
    'Manage the homepage \u2014 hero, stats, principal\u2019s message, latest news, academic streams, life at KCC, campus showcase, achievement ticker, and societies preview.',
  sections: [
    {
      key: 'home.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description: 'Eyebrow, tagline, CTA buttons, optional video background.',
      schema: HomeHeroSchema,
    },
    {
      key: 'home.stats',
      blockKey: 'stats',
      label: 'Stats Strip',
      description:
        'Students, staff, years, university entrances (auto-counting).',
      schema: HomeStatsSchema,
    },
    {
      key: 'home.principal',
      blockKey: 'rich-text-block',
      label: "Principal's Message",
      description:
        'Portrait, name, tenure, quote, and link to the full message.',
      schema: HomePrincipalSchema,
    },
    {
      key: 'home.news',
      blockKey: 'rich-text-block',
      label: 'Latest News',
      description: 'Latest 3 news items from the CMS, linked to /news.',
      schema: HomeNewsSchema,
    },
    {
      key: 'home.academicStreams',
      blockKey: 'rich-text-block',
      label: 'Academic Streams',
      description:
        'Grid of stream cards \u2014 name, description, career paths.',
      schema: HomeAcademicStreamsSchema,
    },
    {
      key: 'home.lifeAtKCC',
      blockKey: 'photo-strip',
      label: 'Life at KCC',
      description:
        'Horizontal scroll of photos \u2014 sports, events, performances, academic.',
      schema: HomeLifeAtKCCSchema,
    },
    {
      key: 'home.campusShowcase',
      blockKey: 'rich-text-block',
      label: 'Campus Showcase',
      description:
        'Highlights of the main building, library, pool, and sports ground.',
      schema: HomeCampusShowcaseSchema,
    },
    {
      key: 'home.achievements',
      blockKey: 'rich-text-block',
      label: 'Achievement Ticker',
      description: 'Marquee of recent achievements.',
      schema: HomeAchievementsSchema,
    },
    {
      key: 'home.societies',
      blockKey: 'rich-text-block',
      label: 'Societies Preview',
      description:
        '3\u20134 featured societies \u2014 name, tagline, category, image.',
      schema: HomeSocietiesSchema,
    },
  ],
};
