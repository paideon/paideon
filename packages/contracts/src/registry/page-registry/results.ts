// packages/contracts/src/registry/page-registry/results.ts
//
// Page registry for: Results. Also not in docs/Design System/Page
// Specifications.md's 12 written sections, same gap as events.ts — but
// confirmed real by the Feature Registry (F-051, F-052) and PAGE_KEY_VALUES.
// This is the aggregate O/L and A/L results page — island rank, subject
// pass rates, stream performance, never individual student grades (see
// domains/results/ol-aggregate-statistics.ts's own header note). Distinct
// from the Academics page's small manual stats strip, which has no live
// results feed behind it at all.

import { HeroSchema } from '../../blocks/index.ts';
import { ResultsPageSchema } from '../../domains/results/display.ts';
import type { PageRegistry } from '../types.ts';

export const ResultsHeroSchema = HeroSchema;

export const resultsRegistry: PageRegistry = {
  page: 'results',
  scope: 'page:results',
  label: 'Results',
  description:
    'Manage the Results page \u2014 aggregate O/L and A/L exam statistics by year. Composed from OLResult and ALResult records; never individual student data.',
  sections: [
    {
      key: 'results.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description: 'Top-of-page headline and eyebrow text.',
      schema: ResultsHeroSchema,
    },
    {
      key: 'results.page',
      blockKey: 'results-display',
      label: 'Results by Year',
      description:
        'One entry per year, each with optional O/L and A/L aggregate result data, plus an optional disclaimer.',
      schema: ResultsPageSchema,
    },
  ],
};
