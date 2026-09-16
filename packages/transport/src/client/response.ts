// packages/transport/src/client/response.ts

// ── Status range utilities ──────────────────────────────────────────────────
// Instead of `status >= 200 && status < 300` scattered everywhere.

export function isSuccess(status: number): boolean {
  return status >= 200 && status < 300;
}

export function isRedirect(status: number): boolean {
  return status >= 300 && status < 400;
}

export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

export function isServerError(status: number): boolean {
  return status >= 500 && status < 600;
}

// ── Content-type detection ──────────────────────────────────────────────────

export function isJsonResponse(response: Response): boolean {
  return (
    response.headers.get("content-type")?.includes("application/json") ?? false
  );
}

export function isTextResponse(response: Response): boolean {
  return response.headers.get("content-type")?.includes("text/") ?? false;
}

export function isBlobResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  return (
    Boolean(contentType) &&
    !isJsonResponse(response) &&
    !isTextResponse(response)
  );
}

// ── Parsing ──────────────────────────────────────────────────────────────────

/** One place that decides json vs text vs blob, instead of `await res.json()` everywhere. */
export async function parseResponse<T = unknown>(
  response: Response
): Promise<T> {
  if (response.status === 204) return undefined as T;
  if (isJsonResponse(response)) return (await response.json()) as T;
  if (isTextResponse(response)) return (await response.text()) as unknown as T;
  return (await response.blob()) as unknown as T;
}
