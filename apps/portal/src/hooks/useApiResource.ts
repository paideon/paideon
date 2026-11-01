'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ZodType, ZodTypeDef } from 'zod';

import { apiFetch } from '@/lib/api';

export type ApiResource<T> = {
  data: T | null;
  /** Message to show, or '' while loading or after success. */
  error: string;
  loading: boolean;
  reload: () => void;
};

/**
 * GET `path` once on mount and check the answer against its contract.
 * `path` null means "do not fetch" (used to skip a request for some roles).
 */
export function useApiResource<T>(
  path: string | null,
  schema: ZodType<T, ZodTypeDef, unknown>,
): ApiResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(path !== null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (path === null) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    apiFetch<unknown>(path)
      .then((body) => {
        if (!active) return;
        const parsed = schema.safeParse(body);
        if (parsed.success) setData(parsed.data);
        else setError('The server sent something unexpected. Try again later.');
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error && cause.message
            ? cause.message
            : 'Could not load this. Check your connection and try again.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // `schema` is a module-level constant at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { data, error, loading, reload };
}
