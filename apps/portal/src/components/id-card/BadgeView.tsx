'use client';

import { useState } from 'react';
import { MyProfileSchema } from '@paideon/contracts';
import {
  Button,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  PrintSheet,
  Text,
} from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { badgeDetails } from '@/lib/badge';

import { IdCardFlat } from './IdCardFlat';

export function BadgeView() {
  const { data, error, loading, reload } = useApiResource(
    '/me/profile',
    MyProfileSchema,
  );
  const [fullScreen, setFullScreen] = useState(false);

  if (loading && !data) return <LoadingSkeleton variant="section" />;
  if (!data)
    return <ErrorState variant="section" message={error} onRetry={reload} />;

  const details = badgeDetails(data);

  return (
    <div className="flex flex-col gap-space-6">
      <PageHeader
        title="ID badge and library card"
        description="Show this at the library desk, or print it at its real size."
        actions={
          <>
            <Button variant="secondary" onClick={() => setFullScreen(true)}>
              Show full screen
            </Button>
            <Button onClick={() => window.print()}>Print</Button>
          </>
        }
      />

      <PrintSheet columns={1}>
        <IdCardFlat details={details} photoUrl={data.photoUrl} />
      </PrintSheet>

      <Text variant="body-sm" color="muted">
        The card prints at 85.6 × 54 mm, the size of a bank card. In the print
        window, set Scale to 100% and turn on Background graphics.
      </Text>

      {fullScreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ID card, full screen"
          className="fixed left-0 top-0 z-toast flex h-screen w-screen flex-col items-center justify-center gap-space-6 bg-surface-canopy p-space-4"
        >
          {/* min() keeps the whole card on screen in portrait and landscape */}
          <IdCardFlat
            details={details}
            photoUrl={data.photoUrl}
            width="min(94vw, 140vh)"
          />
          <Button
            variant="secondary"
            onClick={() => setFullScreen(false)}
            autoFocus
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
