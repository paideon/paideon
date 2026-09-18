// packages/contracts/src/registry/page-registry/societies.ts
//
// Page registry for: Societies Hub. Only the hero survives as a registry
// section as of Task 7.6/F-167 — same precedent as
// registry/page-registry/news.ts's and events.ts's own notes.
//
// `societies.grid` (and `SocietiesGridSchema`) is removed as of this
// milestone. It was a ContentEntry placeholder — an editor hand-pasting a
// `societies: SocietyCardSchema[]` array into a generic rich-text-block
// section, once per locale — authored while Society was still a
// "deferred domain model" (F-057). Now that `Society` is real
// (schema.prisma) and `societiesRouter` is mounted, the Societies Hub
// grid is populated live via `societies.list`, not from a ContentEntry
// row.
//
// Individual society pages (/societies/[slug]) aren't part of this
// registry entry either — their Leadership (advisor StaffCard),
// founding-year/member-count stats, and banner are composed at the
// page-fetcher level from the `Society` row itself (plus one
// `staff.byId` lookup for the advisor), not from registry sections. Recent
// Events and Gallery sections mentioned in this file's previous version
// are deferred — see docs/Completion Plan.md's verification note on why
// (no Society↔Event relation exists in the Events schema, and the Gallery
// module (Task 7.7) doesn't exist yet at all).

import { HeroSchema } from "../../blocks/index.ts";
import type { PageRegistry } from "../types.ts";

export const SocietiesHeroSchema = HeroSchema;

export const societiesRegistry: PageRegistry = {
  page: "societies",
  scope: "page:societies",
  label: "Societies Hub",
  description:
    "Manage the Societies Hub page hero. The society grid is populated automatically from the Societies module — manage those under Societies, not here.",
  sections: [
    {
      key: "societies.hero",
      blockKey: "hero",
      label: "Hero Banner",
      description: "Top-of-page headline and eyebrow text.",
      schema: SocietiesHeroSchema,
    },
  ],
};
