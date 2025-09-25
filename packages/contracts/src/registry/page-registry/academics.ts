// packages/contracts/src/registry/page-registry/academics.ts
//
// Page registry for: Academics (docs/Design System/Page Specifications.md
// section 04). No live performance-statistics feed — the exam results
// portal that would have backed pass rates/university-entrance counts was
// cut from scope, so Performance Statistics here is a manually-entered
// stats block, not results-derived data.
//
// The public page shows four stream cards (Science, Commerce, Arts,
// Technology) but ALStreamEnum has five real values, since Combined Maths
// and Bio Science are formally distinct A/L streams. This schema doesn't
// force a choice — admins can populate four cards (merging the two Science
// variants into one) or five. Worth a decision before content goes in.

import { z } from 'zod';

import { CtaSchema, HeroSchema, StatsSchema } from '../../blocks/index.ts';
import { ALStreamSchema } from '../../domains/academics/al-stream.ts';
import { DepartmentKeyEnum } from '../../domains/academics/department.ts';
import { StreamComparisonSchema } from '../../domains/academics/stream-comparison.ts';
import type { PageRegistry } from '../types.ts';

export const AcademicsHeroSchema = HeroSchema;

export const AcademicsIntroSchema = z.object({
  heading: z.string().optional(),
  body: z.string(),
});
export type AcademicsIntroData = z.infer<typeof AcademicsIntroSchema>;

export const AcademicsStreamCardsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  streams: z.array(ALStreamSchema),
});
export type AcademicsStreamCardsData = z.infer<
  typeof AcademicsStreamCardsSchema
>;

export const AcademicsStreamComparisonSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  comparisons: z.array(StreamComparisonSchema),
});
export type AcademicsStreamComparisonData = z.infer<
  typeof AcademicsStreamComparisonSchema
>;

export const AcademicsDepartmentContactSchema = z.object({
  department: DepartmentKeyEnum,
  headOfDepartment: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const AcademicsContactsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  contacts: z.array(AcademicsDepartmentContactSchema),
});
export type AcademicsContactsData = z.infer<typeof AcademicsContactsSchema>;

export const AcademicsStatsSchema = StatsSchema;

export const AcademicsCtaSchema = CtaSchema;

export const academicsRegistry: PageRegistry = {
  page: 'academics',
  scope: 'page:academics',
  label: 'Academics',
  description:
    'Manage the Academic streams, comparisons, and department contacts.',
  sections: [
    {
      key: 'academics.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description: 'Top-of-page headline and eyebrow text.',
      schema: AcademicsHeroSchema,
    },
    {
      key: 'academics.intro',
      blockKey: 'rich-text-block',
      label: 'Academic Culture Intro',
      description: 'Brief statement on holistic education (Head, Heart, Hand).',
      schema: AcademicsIntroSchema,
    },
    {
      key: 'academics.streams',
      blockKey: 'rich-text-block',
      label: 'Stream Cards',
      description: 'Grid of academic stream cards.',
      schema: AcademicsStreamCardsSchema,
    },
    {
      key: 'academics.comparison',
      blockKey: 'rich-text-block',
      label: 'Stream Comparison',
      description: 'Table comparing academic streams.',
      schema: AcademicsStreamComparisonSchema,
    },
    {
      key: 'academics.stats',
      blockKey: 'stats',
      label: 'Performance Statistics',
      description:
        'Manually-entered stats strip (pass rates, university entrances, district ranking) — not backed by a live results feed.',
      schema: AcademicsStatsSchema,
    },
    {
      key: 'academics.contacts',
      blockKey: 'rich-text-block',
      label: 'Department Contacts',
      description: 'List of departmental contact information.',
      schema: AcademicsContactsSchema,
    },
    {
      key: 'academics.cta',
      blockKey: 'cta',
      label: 'Call to Action',
      description: 'Call to action section at the bottom of the page.',
      schema: AcademicsCtaSchema,
    },
  ],
};
