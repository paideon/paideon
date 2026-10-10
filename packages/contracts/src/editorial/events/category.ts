// packages/contracts/src/editorial/events/category.ts
//
// Event category definitions.

import { z } from 'zod';

export const EVENT_CATEGORY_CONTENT_TYPE = 'event-category';

export const EVENT_CATEGORIES = {
  academic: 'Academic',
  sports: 'Sports',
  cultural: 'Cultural',
  exam: 'Exam',
  holiday: 'Holiday',
  other: 'Other',
} as const;

export type EventCategoryKey = keyof typeof EVENT_CATEGORIES;

export const EventCategorySchema = z.enum(
  Object.keys(EVENT_CATEGORIES) as [EventCategoryKey, ...EventCategoryKey[]],
);

export type EventCategoryMeta = {
  key: EventCategoryKey;
  label: string;
  color?: string;
};

export const EVENT_CATEGORY_META: EventCategoryMeta[] = Object.entries(
  EVENT_CATEGORIES,
).map(([key, label]) => ({
  key: key as EventCategoryKey,
  label,
}));

export type EventCategory = EventCategoryKey;
