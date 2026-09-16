// packages/transport/src/errors/normalize.ts

import { ApiError } from "./api-error.js";
import { codeFromStatus } from "./error-codes.js";

/**
 * Turns a failed Response, an AbortError, a network TypeError, or any other
 * thrown value into an ApiError. Safe to call on something that's already
 * an ApiError — it's returned as-is.
 */
export async function normalizeError(source: unknown): Promise<ApiError> {
  if (source instanceof ApiError) return source;

  if (source instanceof Response) {
    const { status } = source;
    let message = `Request failed with status ${status}`;
    let details: ApiErrorDetailsFromBody;

    try {
      const body = await source.clone().json();
      if (body && typeof body === "object") {
        details = body as ApiErrorDetailsFromBody;
        const maybeMessage = (body as { message?: unknown }).message;
        if (typeof maybeMessage === "string") message = maybeMessage;
      }
    } catch {
      // Body wasn't JSON (or there was no body) — keep the generic message.
    }

    return new ApiError({
      status,
      code: codeFromStatus(status),
      message,
      details,
    });
  }

  if (source instanceof DOMException && source.name === "AbortError") {
    return new ApiError({
      status: 0,
      code: "TIMEOUT",
      message: "Request timed out",
      cause: source,
    });
  }

  if (source instanceof TypeError) {
    return new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: source.message || "Network request failed",
      cause: source,
    });
  }

  if (source instanceof Error) {
    return new ApiError({
      status: 0,
      code: "UNKNOWN",
      message: source.message,
      cause: source,
    });
  }

  return new ApiError({
    status: 0,
    code: "UNKNOWN",
    message: "Unknown error",
    cause: source,
  });
}

type ApiErrorDetailsFromBody = Record<string, unknown> | undefined;
