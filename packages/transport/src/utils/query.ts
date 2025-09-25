// packages/transport/src/utils/query.ts

import { toSearchParams } from '../serialization/search-params.js';

/** Builds a leading-`?` query string from a params object; returns '' when there's nothing to send. */
export function buildQuery(params: Record<string, unknown>): string {
  const value = toSearchParams(params).toString();
  return value ? `?${value}` : '';
}
