// packages/transport/src/headers/common.ts

import type { HeadersInit } from '../client/request.js';

/** Content-Type: application/json + Accept: application/json. */
export function createJsonHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  return headers;
}
