// packages/contracts/src/editorial/events/event.ts
//
// F-198 "Calendar-First Event Architecture" (see Feature Registry) super-
// sedes the standalone `EventSchema` that used to live here. There is no
// longer a full "Event" entity independent of the calendar: every dated
// item on the platform — a holiday, an exam date, a prize-giving — is a
// `CalendarEntry` row (calendar.ts), and a `CalendarEntry` optionally
// carries a linked `EventDetail` (description, cover image, location,
// registration link, draft/published/archived status) that is what
// actually produces a public card and a routable /events/[slug] page. A
// calendar-only entry has no detail, is never rendered as a card, and has
// no route.
//
// `EventDetail` (the real, persisted entity `EventSchema` used to
// describe) now lives as Zod I/O schemas in
// packages/api/src/modules/events/validators.ts, matching the same
// layering `NewsArticleCreateInput`/`NewsArticleOutput` already
// established for News: @paideon/contracts holds the display projection
// consumed across apps (`EventCardSchema` below) and the shared taxonomy
// (category.ts), not the full admin-CRUD entity shape — that belongs next
// to the router/service that actually validates and persists it.
//
// EventCardSchema stays here unchanged — it's the projection @paideon/ui's
// EventCard/Calendar components already consume directly, independent of
// which module produced the data.

import { z } from "zod";

export const EVENT_CONTENT_TYPE = "event";

export const EventStatus = z.enum([
  "upcoming",
  "today",
  "ongoing",
  "past",
  "registration-open",
  "registration-closed",
]);

export const EventCardVariant = z.enum(["standard", "compact", "featured"]);

// Card projection — matches @paideon/ui's EventCardProps / Calendar.tsx exactly.
export const EventCardSchema = z.object({
  id: z.string(),
  variant: EventCardVariant.optional(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  time: z.string().optional(),
  venue: z.string().optional(),
  category: z.string().optional(),
  status: EventStatus.optional(),
  href: z.string(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  relativeTime: z.string().optional(),
  registrationHref: z.string().optional(),
});

export type EventCardData = z.infer<typeof EventCardSchema>;
export type EventStatusType = z.infer<typeof EventStatus>;
export type EventCardVariantType = z.infer<typeof EventCardVariant>;

// Runtime enum values for comparisons
export const EventStatusValues = EventStatus.enum;
export const EventCardVariantValues = EventCardVariant.enum;
