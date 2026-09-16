// packages/transport/src/pagination/offset.ts

export interface OffsetPageParams {
  page: number;
  pageSize: number;
}

export interface OffsetPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Reads `page`/`pageSize` out of a loosely-typed query object; both are clamped to at least 1. */
export function parseOffsetParams(
  query: Record<string, unknown>,
  defaultPageSize = 20
): OffsetPageParams {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.max(1, Number(query.pageSize) || defaultPageSize);

  return { page, pageSize };
}

export function createOffsetPage<T>(
  items: T[],
  total: number,
  params: OffsetPageParams
): OffsetPage<T> {
  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
}
