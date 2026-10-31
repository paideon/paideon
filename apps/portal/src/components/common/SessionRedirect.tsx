'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { fetchCurrentUser } from '@/lib/api';

/**
 * Renders nothing. If the visitor already has a session, sends them on to
 * `to`. Anonymous visitors stay where they are (no redirect to /login).
 */
export function SessionRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetchCurrentUser({ redirectOnAuthFailure: false })
      .then(() => {
        if (active) router.replace(to);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [router, to]);

  return null;
}
