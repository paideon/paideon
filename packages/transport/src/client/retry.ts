// packages/transport/src/client/retry.ts

import { ApiError } from "../errors/api-error.js";

export interface RetryOptions {
  retries?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  /** Return false to stop retrying immediately. Defaults to retrying network errors, 429s, and 5xxs. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

const defaultShouldRetry = (error: unknown): boolean => {
  if (error instanceof ApiError)
    return error.status === 0 || error.status === 429 || error.status >= 500;
  return true;
};

/** Retries `fn` with exponential backoff + jitter. Re-throws the last error once retries are exhausted. */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    minDelayMs = 200,
    maxDelayMs = 2000,
    shouldRetry = defaultShouldRetry,
  } = options;

  let attempt = 0;

  for (;;) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries || !shouldRetry(error, attempt)) throw error;

      const backoff = Math.min(maxDelayMs, minDelayMs * 2 ** attempt);
      const jitterMs = Math.random() * backoff * 0.2;
      await sleep(backoff + jitterMs);
      attempt += 1;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
