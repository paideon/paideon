// packages/contracts/src/registry/page-registry/facilities.ts
//
// Page registry for: Facilities (docs/Design System/Page Specifications.md
// section 07).

import { z } from 'zod';

import { CtaSchema, HeroSchema, StatsSchema } from '../../blocks/index.ts';
import { FacilitySchema } from '../../domains/facilities/facility-profile.ts';
import type { PageRegistry } from '../types.ts';

export const FacilitiesHeroSchema = HeroSchema;

export const FacilitiesStatsSchema = StatsSchema;

export const FacilitiesGridSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  facilities: z.array(FacilitySchema),
});
export type FacilitiesGridData = z.infer<typeof FacilitiesGridSchema>;

export const FacilitiesCtaSchema = CtaSchema;

export const facilitiesRegistry: PageRegistry = {
  page: 'facilities',
  scope: 'page:facilities',
  label: 'Facilities',
  description:
    'The Facilities page showcases KCC campus infrastructure — classrooms, laboratories, libraries, sports facilities, and student amenities.',
  sections: [
    {
      key: 'facilities.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description:
        'Eyebrow text (e.g. "Campus Infrastructure"), page headline, optional emphasised word, and subtitle shown at the top of the page.',
      schema: FacilitiesHeroSchema,
    },
    {
      key: 'facilities.stats',
      blockKey: 'stats',
      label: 'Stats Strip',
      description:
        'The counter strip below the hero (classrooms, labs, etc). Each stat has a target number, label, and optional prefix/suffix.',
      schema: FacilitiesStatsSchema,
    },
    {
      key: 'facilities.grid',
      blockKey: 'rich-text-block',
      label: 'Facilities Grid',
      description:
        'One card per facility (Main Building, Science Labs, ICT Labs, Auditorium, Sports Grounds, Swimming Pool, Library). The Swimming Pool is the only one with a schedule.',
      schema: FacilitiesGridSchema,
    },
    {
      key: 'facilities.cta',
      blockKey: 'cta',
      label: 'Call-to-Action',
      description:
        'Bottom section with heading, subtitle, and button(s) to encourage visits or contact.',
      schema: FacilitiesCtaSchema,
    },
  ],
};
