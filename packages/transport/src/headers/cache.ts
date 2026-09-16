// packages/transport/src/headers/cache.ts

import type { HeadersInit } from "../client/request.js";

/** Cache-Control: no-store — for requests that must never be cached. */
export function createNoCacheHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("Cache-Control", "no-store");
  return headers;
}

/** Cache-Control: public, max-age=<seconds> — for cacheable GETs. */
export function createCacheHeaders(
  maxAgeSeconds: number,
  extra?: HeadersInit
): Headers {
  const headers = new Headers(extra);
  headers.set("Cache-Control", `public, max-age=${maxAgeSeconds}`);
  return headers;
}
