'use client';

import { useEffect } from 'react';
import { ErrorState, Heading } from '@paideon/ui';

// Catches anything that throws while a page renders. `reset` re-renders the
// page without a full reload.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-prose flex-col justify-center gap-space-4 p-space-6">
      <Heading as="h1" level="h2">
        Something went wrong
      </Heading>
      <ErrorState
        variant="section"
        message="This page could not be shown. Try again, and if it keeps happening, tell the school office."
        onRetry={reset}
      />
    </main>
  );
}
