// packages/contracts/src/primitieves/pagination.ts

// Pagination contracts for list endpoints and admin tables.
//
// Should contain:
//   PageInputSchema    — page (number ≥ 1), pageSize (number, default 20, max 100)
//   CursorInputSchema  — cursor (string | null), limit (number, default 20)
//   PaginationMeta     — total, page, pageSize, totalPages, hasNextPage, hasPrevPage
//   CursorMeta         — nextCursor (string | null), hasMore
//
// Used by:
//   core/api/content-entry.ts — list procedure inputs
//   editorial/news/article.ts — article list pagination
//   editorial/events/event.ts — event list pagination

import { z } from 'zod';

export const PageInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const CursorInputSchema = z.object({
  cursor: z.string().nullable().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const CursorMetaSchema = z.object({
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
});

export type PageInput = z.infer<typeof PageInputSchema>;
export type CursorInput = z.infer<typeof CursorInputSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type CursorMeta = z.infer<typeof CursorMetaSchema>;
export type Pagination = PaginationMeta;
