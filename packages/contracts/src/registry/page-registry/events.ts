// packages/contracts/src/registry/page-registry/events.ts
//
// Page registry for: Events / School Calendar (F-052, F-145). Only the
// hero survives as a PageRegistry section as of M4/F-198 — see the M3 note
// on registry/page-registry/news.ts for the identical precedent this
// follows.
//
// `events.upcoming` / `events.past` (and their EventsUpcomingSchema/
// EventsPastSchema) are removed as of this milestone. They were
// ContentEntry placeholders authored while Events was still a "deferred
// domain model" (F-057, per editorial/events/calendar.ts's old doc
// comment: "Stored in ContentEntry with scope 'editorial:calendar'") — an
// editor would hand-paste an `events: EventCardSchema[]` array into a
// generic rich-text-block textarea, once per section, once per locale.
// Now that CalendarEntry/EventDetail are real (schema.prisma) and
// eventsRouter is mounted, the calendar grid and event-card list on
// /events are populated live from `events.calendar` / `events.list`, not
// from a ContentEntry row — the same shift M3 made for News's featured
// slot and feed.
//
// The full article page (/events/[slug]) reads a single CalendarEntry +
// its linked EventDetail via the `events` tRPC router, exactly like
// news.ts's own note about /news/[slug] — it isn't a registry section
// here either, since it's one calendar entry at a time, not a page
// composed of interchangeable ContentEntry sections.

import { HeroSchema } from "../../blocks/index.ts";
import type { PageRegistry } from "../types.ts";

export const EventsHeroSchema = HeroSchema;

export const eventsRegistry: PageRegistry = {
  page: "events",
  scope: "page:events",
  label: "Events",
  description:
    "Manage the Events page hero. The calendar grid and event list are populated automatically from the school calendar — manage those under the Events module, not here.",
  sections: [
    {
      key: "events.hero",
      blockKey: "hero",
      label: "Hero Banner",
      description: "Top-of-page headline and eyebrow text.",
      schema: EventsHeroSchema,
    },
  ],
};
