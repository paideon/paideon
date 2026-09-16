// packages/transport/src/errors/error-codes.ts

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "UNKNOWN";

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "RATE_LIMITED",
};

/** Maps an HTTP status code to a stable, app-facing error code. */
export function codeFromStatus(status: number): ApiErrorCode {
  const known = STATUS_TO_CODE[status];
  if (known) return known;
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}
