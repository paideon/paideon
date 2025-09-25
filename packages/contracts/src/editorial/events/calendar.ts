// packages/contracts/src/editorial/events/calendar.ts
//
// F-198 "Calendar-First Event Architecture" (M4, Task 7.5) — CalendarEntry
// is now a real Prisma model (schema.prisma) and Zod I/O schemas for the
// admin CRUD live in packages/api/src/modules/events/validators.ts, the
// same layering event.ts's header comment describes for EventDetail.
// CalendarEntrySchema below survives as the read-only display projection —
// every field a consumer needs to render a calendar grid entry, without
// depending on packages/api's create/update input shapes (which also carry
// admin-only concerns like locale/id) — mirroring how ArticleCardSchema
// (editorial/news/article.ts) is the display projection independent of
// NewsArticleOutput.
//
// `AcademicCalendarSchema` is removed as of this milestone. It was a
// ContentEntry-era placeholder (the doc comment this replaces literally
// said "Stored in ContentEntry with scope 'editorial:calendar'") shaped
// for a single hand-authored JSON blob — one row holding an entire year's
// `entries` array — which doesn't fit a real per-row Prisma model with
// its own id, indexing, and admin CRUD. Nothing in the codebase ever
// imported it. Same removal, same reasoning as `NewsFeaturedSchema`/
// `NewsFeedSchema` in registry/page-registry/news.ts's M3 note.

import { z } from 'zod';

import { EventCategorySchema } from './category.ts';
import { LocaleEnum } from '../../primitives/index.ts';

export const CalendarEntrySchema = z.object({
  id: z.string().min(1),
  locale: LocaleEnum,
  title: z.string().min(1),
  date: z.string().min(1), // ISO date (YYYY-MM-DD)
  category: EventCategorySchema,
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.string().optional(),
  notes: z.string().optional(),
});

export type CalendarEntryData = z.infer<typeof CalendarEntrySchema>;
