// packages/contracts/src/registry/pages/about.ts

import { z } from 'zod';

import {
  HeroSchema,
  type HeroData,
  StatsSchema,
  type StatsData,
  AnthemSchema,
  type AnthemData,
  CrestSchema,
  type CrestData,
  TimelineItemSchema,
} from '../../blocks/index.ts';
import { AlumniSchema } from '../../domains/people/alumni.ts';
import type { PageRegistry } from '../types.ts';

// ── Section schemas ─────────────────────────────────────────────────────

export const AboutHeroSchema = HeroSchema;
export type AboutHeroData = HeroData;

export const AboutStatsSchema = StatsSchema;
export type AboutStatsData = StatsData;

export const AboutCrestSchema = CrestSchema;
export type AboutCrestData = CrestData;

export const AboutAnthemSchema = AnthemSchema;
export type AboutAnthemData = AnthemData;

export const AboutTimelineSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  milestones: z.array(TimelineItemSchema),
});
export type AboutTimelineData = z.infer<typeof AboutTimelineSchema>;

export const AboutStorySchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  headingEm: z.string().optional(),
  paragraph: z.string(),
  quote: z.string().optional(),
  quoteAuthor: z.string().optional(),
});
export type AboutStoryData = z.infer<typeof AboutStorySchema>;

export const AboutKannangaraSchema = z.object({
  eyebrow: z.string(),
  name: z.string(),
  position: z.string(),
  portraitSrc: z.string().optional(),
  portraitAlt: z.string(),
  portraitCaption: z.string().optional(),
  paragraph: z.string(),
  quote: z.string().optional(),
  attribution: z.string().optional(),
});
export type AboutKannangaraData = z.infer<typeof AboutKannangaraSchema>;

export const AboutEthosSchema = z.object({
  visionEyebrow: z.string(),
  visionText: z.string(),
  missionEyebrow: z.string(),
  missionText: z.string(),
  mottoEyebrow: z.string().optional(),
  motto: z.string(),
});
export type AboutEthosData = z.infer<typeof AboutEthosSchema>;

export const AboutValueItemSchema = z.object({
  id: z.string(),
  english: z.string(),
  latin: z.string(),
  desc: z.string(),
});

export const AboutValuesSchema = z.object({
  valuesEyebrow: z.string(),
  values: z.array(AboutValueItemSchema),
});
export type AboutValuesData = z.infer<typeof AboutValuesSchema>;

export const AboutLegacySchema = z.object({
  spirit: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraph: z.string(),
    quote: z.string(),
    attribution: z.string().optional(),
  }),
  heritage: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    caption: z.string(),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          year: z.string().optional(),
        }),
      )
      .default([]),
  }),
});
export type AboutLegacyData = z.infer<typeof AboutLegacySchema>;

export const AboutAlumniSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  profiles: z.array(AlumniSchema).default([]),
});
export type AboutAlumniData = z.infer<typeof AboutAlumniSchema>;

export const AboutClosingSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  body: z.string(),
  rule: z.string(),
});
export type AboutClosingData = z.infer<typeof AboutClosingSchema>;

// ── Page registry ───────────────────────────────────────────────────────

export const aboutRegistry: PageRegistry = {
  page: 'about',
  scope: 'page:about',
  label: 'About KCC',
  description:
    "The About page introduces KCC — its history, the legacy of Dr. Kannangara, the school's ethos, and more.",
  sections: [
    {
      key: 'about.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description:
        'Eyebrow text (e.g. "Est. 1873 · Mathugama"), page headline, optional emphasised word, and subtitle shown at the top of the page.',
      schema: AboutHeroSchema,
    },
    {
      key: 'about.stats',
      blockKey: 'stats',
      label: 'Stats Strip',
      description:
        'The counter strip below the hero (student count, staff count, etc). Each stat has a target number, label, and optional prefix/suffix.',
      schema: AboutStatsSchema,
    },
    {
      key: 'about.story',
      blockKey: 'rich-text-block',
      label: 'Our Story',
      description:
        'The founding narrative of KCC — eyebrow, heading, body paragraph, and optional pull-quote with attribution.',
      schema: AboutStorySchema,
    },
    {
      key: 'about.aboutKannangara',
      blockKey: 'rich-text-block',
      label: 'Our Namesake',
      description:
        'Profile of Dr. C.W.W. Kannangara — name, title, portrait image, biography paragraph, and optional quote.',
      schema: AboutKannangaraSchema,
    },
    {
      key: 'about.timeline',
      blockKey: 'timeline',
      label: 'Historical Timeline',
      description:
        "Key milestones in KCC's history. Each milestone has a year, title, description, and era (early / mid / modern).",
      schema: AboutTimelineSchema,
    },
    {
      key: 'about.ethos',
      blockKey: 'quote',
      label: 'Ethos — Vision, Mission & Motto',
      description:
        "The school's eyebrow labels, vision statement, mission statement, and motto. Each has its own eyebrow.",
      schema: AboutEthosSchema,
    },
    {
      key: 'about.values',
      blockKey: 'values-grid',
      label: 'Core Values',
      description:
        'The four school values. Each has an English name, a Latin name, and a description.',
      schema: AboutValuesSchema,
    },
    {
      key: 'about.crest',
      blockKey: 'crest-symbols',
      label: 'Crest Explained',
      description:
        'Eyebrow, heading, intro paragraph, and list of crest symbols. Each symbol has a name, meaning, and position label.',
      schema: AboutCrestSchema,
    },
    {
      key: 'about.alumni',
      blockKey: 'rich-text-block',
      label: 'Alumni Legacy',
      description:
        'Notable alumni carousel — section eyebrow and heading, plus a list of alumni profiles (name, graduation year, current role/org, quote, optional portrait). Only entries marked isFeatureworthy show here.',
      schema: AboutAlumniSchema,
    },
    {
      key: 'about.legacy',
      blockKey: 'rich-text-block',
      label: 'Legacy',
      description:
        'Two sub-sections: "Spirit of Kannangara" (eyebrow, heading, paragraph, pull-quote) and "Physical Heritage" (eyebrow, heading, caption, optional photo grid).',
      schema: AboutLegacySchema,
    },
    {
      key: 'about.anthem',
      blockKey: 'anthem',
      label: 'School Anthem',
      description:
        'Anthem section heading, description paragraph, audio player labels, and Sinhala lyrics text.',
      schema: AboutAnthemSchema,
    },
    {
      key: 'about.closing',
      blockKey: 'rich-text-block',
      label: 'Closing Statement',
      description:
        'Eyebrow, final heading, body paragraph, and footnote rule shown at the very bottom of the page.',
      schema: AboutClosingSchema,
    },
  ],
};
