// packages/transport/src/client/request.ts

import { buildQuery } from "../utils/query.js";
import { joinUrl } from "../utils/url.js";

// @types/node exposes the `Headers` / `Request` / `RequestInit` classes as
// globals (via its undici-based fetch shim) but — without the "dom" lib —
// doesn't expose the `HeadersInit` / `BodyInit` convenience aliases used
// inside their signatures. Deriving them from the classes themselves keeps
// this package correct under both a Node-only tsconfig and a "dom" one.
export type HeadersInit = NonNullable<ConstructorParameters<typeof Headers>[0]>;
export type BodyInit = NonNullable<RequestInit["body"]>;

export interface RequestConfig {
  baseUrl?: string;
  headers?: HeadersInit;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
}

/** Joins baseUrl + path and appends a query string built from `query`, if any. */
export function buildUrl(
  path: string,
  config?: Pick<RequestConfig, "baseUrl" | "query">
): string {
  const url = config?.baseUrl ? joinUrl(config.baseUrl, path) : path;
  if (!config?.query) return url;

  const query = buildQuery(config.query);
  if (!query) return url;

  return `${url}${url.includes("?") ? query.replace("?", "&") : query}`;
}

/** Builds a RequestInit: sets the method, attaches headers/signal, and serializes the body if it isn't already BodyInit. */
export function buildInit(
  method: string,
  body: unknown,
  config?: RequestConfig
): RequestInit {
  const init: RequestInit = { method, signal: config?.signal };

  if (config?.headers) init.headers = config.headers;

  if (body !== undefined) {
    init.body = isBodyInit(body) ? body : JSON.stringify(body);
  }

  return init;
}

function isBodyInit(value: unknown): value is BodyInit {
  return (
    typeof value === "string" ||
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof Blob ||
    value instanceof ArrayBuffer
  );
}
