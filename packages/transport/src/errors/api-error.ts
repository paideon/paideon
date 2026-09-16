// packages/transport/src/errors/api-error.ts

import type { ApiErrorCode } from "./error-codes.js";

export interface ApiErrorDetails {
  [key: string]: unknown;
}

export interface ApiErrorParams {
  status: number;
  code: ApiErrorCode;
  message: string;
  details?: ApiErrorDetails;
  cause?: unknown;
}

/**
 * The only error shape this package ever throws. Every failure — a non-2xx
 * response, a timeout, a network drop, a bad body — is normalized into one
 * of these so callers never have to guess what they caught.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: ApiErrorDetails;

  constructor(params: ApiErrorParams) {
    super(
      params.message,
      params.cause !== undefined ? { cause: params.cause } : undefined
    );
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}
