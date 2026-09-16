// packages/transport/src/index.ts
//
// @nexus/transport — transport-agnostic contracts and utilities for talking to
// APIs over HTTP. It knows nothing about Next.js, React, Prisma, or the
// database; it only knows fetch, Headers, and Response.
//
// It exists for the calls that don't go through tRPC (@nexus/api) —
// third-party services like Resend or R2, or any plain REST endpoint —
// so those call sites share one client, one error shape, and one set of
// header/pagination/serialization helpers instead of each reinventing them.

export { api } from "./client/index.js";
export type {
  ApiClientConfig,
  ApiHooks,
  RequestConfig,
  RetryOptions,
  Fetcher,
  HeadersInit,
  BodyInit,
} from "./client/index.js";
export {
  retry,
  timeout,
  buildUrl,
  buildInit,
  parseResponse,
  isSuccess,
  isRedirect,
  isClientError,
  isServerError,
  isJsonResponse,
  isTextResponse,
  isBlobResponse,
} from "./client/index.js";

export { ApiError, normalizeError, codeFromStatus } from "./errors/index.js";
export type {
  ApiErrorCode,
  ApiErrorDetails,
  ApiErrorParams,
} from "./errors/index.js";

export {
  createJsonHeaders,
  createAuthHeaders,
  createCacheHeaders,
  createNoCacheHeaders,
} from "./headers/index.js";
export type { AuthScheme } from "./headers/index.js";

export { buildQuery, joinUrl, mergeDeep } from "./utils/index.js";
export type { PlainObject } from "./utils/index.js";

export {
  toJson,
  fromJson,
  toSearchParams,
  toFormData,
} from "./serialization/index.js";

export {
  parseCursorParams,
  createCursorPage,
  parseOffsetParams,
  createOffsetPage,
} from "./pagination/index.js";
export type {
  CursorPageParams,
  CursorPage,
  OffsetPageParams,
  OffsetPage,
} from "./pagination/index.js";
