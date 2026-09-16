// packages/transport/src/headers/auth.ts

import type { HeadersInit } from "../client/request.js";

export type AuthScheme = "Bearer" | "Basic";

/** Sets Authorization: `<scheme> <token>`. Defaults to Bearer. */
export function createAuthHeaders(
  token: string,
  scheme: AuthScheme = "Bearer",
  extra?: HeadersInit
): Headers {
  const headers = new Headers(extra);
  headers.set("Authorization", `${scheme} ${token}`);
  return headers;
}
