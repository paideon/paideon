// packages/transport/src/pagination/cursor.ts

export interface CursorPageParams {
  cursor?: string;
  limit: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

/** Reads `cursor`/`limit` out of a loosely-typed query object, falling back to `defaultLimit`. */
export function parseCursorParams(
  query: Record<string, unknown>,
  defaultLimit = 20
): CursorPageParams {
  const cursor = typeof query.cursor === "string" ? query.cursor : undefined;
  const rawLimit = query.limit;
  const limit =
    typeof rawLimit === "string" || typeof rawLimit === "number"
      ? Number(rawLimit)
      : defaultLimit;

  return {
    cursor,
    limit: Number.isFinite(limit) && limit > 0 ? limit : defaultLimit,
  };
}

/**
 * Given `limit + 1` fetched rows, slices off the extra lookahead row and uses
 * it to derive `nextCursor` — the standard "fetch one more than you need" pattern.
 */
export function createCursorPage<T>(
  rows: T[],
  limit: number,
  getCursor: (item: T) => string
): CursorPage<T> {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? getCursor(items[items.length - 1]) : null;

  return { items, nextCursor };
}
