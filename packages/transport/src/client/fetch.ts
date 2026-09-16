// packages/transport/src/client/fetch.ts
//
// The one client every app should call through — api.get/post/put/patch/delete.
// Everything else in this package (retry, timeout, headers, pagination,
// serialization) is a supporting utility; this file is the surface most
// call sites actually touch.

import { buildInit, buildUrl, type RequestConfig } from "./request.js";
import { parseResponse, isSuccess } from "./response.js";
import { retry, type RetryOptions } from "./retry.js";
import { timeout, type Fetcher } from "./timeout.js";
import { normalizeError } from "../errors/normalize.js";

export interface ApiHooks {
  /** Called once per attempt, right before the request goes out. Never throws for you — logging only. */
  onRequest?: (info: { url: string; init: RequestInit }) => void;
  /** Called once per attempt when a response comes back, success or not. */
  onResponse?: (info: { url: string; response: Response }) => void;
  /** Called once, after retries are exhausted, with the final normalized ApiError. */
  onError?: (info: { url: string; error: unknown }) => void;
}

export interface ApiClientConfig extends RequestConfig, ApiHooks {
  /** Aborts the request after this many milliseconds. Omit to disable. */
  timeoutMs?: number;
  /** Omit to disable retries entirely (the default — most call sites don't want silent retries on writes). */
  retry?: RetryOptions;
  /** Override the underlying fetch implementation (useful in tests). */
  fetcher?: Fetcher;
}

async function send<T>(
  method: string,
  path: string,
  body: unknown,
  config: ApiClientConfig = {}
): Promise<T> {
  const {
    timeoutMs,
    retry: retryOptions,
    fetcher = fetch,
    onRequest,
    onResponse,
    onError,
    ...requestConfig
  } = config;

  const url = buildUrl(path, requestConfig);
  const init = buildInit(method, body, requestConfig);
  const runner = timeoutMs ? timeout(fetcher, timeoutMs) : fetcher;

  const attempt = async (): Promise<Response> => {
    onRequest?.({ url, init });
    const response = await runner(url, init);
    onResponse?.({ url, response });

    if (!isSuccess(response.status)) throw await normalizeError(response);
    return response;
  };

  try {
    const response = retryOptions
      ? await retry(attempt, retryOptions)
      : await attempt();
    return await parseResponse<T>(response);
  } catch (error) {
    const normalized = await normalizeError(error);
    onError?.({ url, error: normalized });
    throw normalized;
  }
}

export const api = {
  get: <T = unknown>(path: string, config?: ApiClientConfig): Promise<T> =>
    send<T>("GET", path, undefined, config),
  post: <T = unknown>(
    path: string,
    body?: unknown,
    config?: ApiClientConfig
  ): Promise<T> => send<T>("POST", path, body, config),
  put: <T = unknown>(
    path: string,
    body?: unknown,
    config?: ApiClientConfig
  ): Promise<T> => send<T>("PUT", path, body, config),
  patch: <T = unknown>(
    path: string,
    body?: unknown,
    config?: ApiClientConfig
  ): Promise<T> => send<T>("PATCH", path, body, config),
  delete: <T = unknown>(path: string, config?: ApiClientConfig): Promise<T> =>
    send<T>("DELETE", path, undefined, config),
};
