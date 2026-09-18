// packages/contracts/src/registry/page-registry/extracurriculars.ts
//
// Page registry for: Extracurriculars (docs/Design System/Page
// Specifications.md section 08). Only page *chrome* lives here now — the
// hero banner. The three ContentEntry-backed `extracurriculars.sports` /
// `.performingArts` / `.leadership` "grid" sections this file previously
// defined were the same placeholder pattern already removed from
// registry/page-registry/news.ts and events.ts once a real router took
// over: F-179 (Task 7.17) gave every activity a genuine
// `ExtracurricularActivity` row served by
// packages/api/src/modules/extracurriculars/router.ts, so there is no
// longer any ActivitySchema-shaped JSON blob for an editor to hand-author
// through the generic block-content system. See events.ts's own header
// comment for the fullest telling of this exact same migration.
//
// The page spec names four subsections (Sports, Performing Arts, Scouts,
// National Cadet Corps), but ExtracurricularCategoryEnum has three values
// — Scouts and the NCC are both 'leadership', matching the real
// ExtracurricularCard component's own variant vocabulary (see Component
// Reference.md). They're still two separate ExtracurricularActivity rows,
// just sharing a category — the public page groups by category, not by
// this four-way split, the same way F-161 describes it.

import { HeroSchema } from "../../blocks/index.ts";
import type { PageRegistry } from "../types.ts";

export const ExtracurricularsHeroSchema = HeroSchema;

export const extracurricularsRegistry: PageRegistry = {
  page: "extracurriculars",
  scope: "page:extracurriculars",
  label: "Extracurriculars",
  description:
    "Manage the Extracurriculars page\u2019s hero banner. Activities themselves are managed under Extracurriculars in the admin sidebar, not here.",
  sections: [
    {
      key: "extracurriculars.hero",
      blockKey: "hero",
      label: "Hero Banner",
      description: "Top-of-page headline and eyebrow text.",
      schema: ExtracurricularsHeroSchema,
    },
  ],
};
