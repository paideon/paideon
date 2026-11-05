// Shared list contracts: the page query every list endpoint accepts, and the
// envelope every list endpoint returns.

import { z } from 'zod';

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 25;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type PaginationQueryData = z.infer<typeof PaginationQuerySchema>;

export const SORT_DIRECTION_VALUES = ['asc', 'desc'] as const;
export const SortDirectionEnum = z.enum(SORT_DIRECTION_VALUES);
export type SortDirectionData = z.infer<typeof SortDirectionEnum>;

/** Wraps an item schema in the list envelope. */
export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
  });
}

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/** Query-string booleans arrive as the text "true" / "false". */
export const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) => value === true || value === 'true');
