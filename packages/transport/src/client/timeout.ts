// packages/transport/src/client/timeout.ts

// Derived from the ambient `fetch` global rather than naming `RequestInfo`
// directly — that alias isn't exposed by @types/node without the "dom" lib.
export type FetchInput = Parameters<typeof fetch>[0];
export type Fetcher = (
  input: FetchInput,
  init?: RequestInit
) => Promise<Response>;

/**
 * Wraps a fetch-like function so every call aborts after `ms` milliseconds.
 * Instead of every call site managing its own AbortController:
 *   const fetchWithTimeout = timeout(fetch, 5000);
 */
export function timeout(fetcher: Fetcher, ms: number): Fetcher {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    const signal = init.signal
      ? mergeSignals(init.signal, controller.signal)
      : controller.signal;

    try {
      return await fetcher(input, { ...init, signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (typeof AbortSignal.any === "function") return AbortSignal.any([a, b]);

  // Fallback for runtimes without AbortSignal.any (Node < 20 / older browsers).
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });
  return controller.signal;
}
