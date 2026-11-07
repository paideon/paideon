'use client';

import { useState } from 'react';
import { StudentBadgeListSchema } from '@paideon/contracts';
import {
  Alert,
  Button,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  PrintSheet,
  Text,
} from '@paideon/ui';

import { IdCardFlat } from '@/components/id-card/IdCardFlat';
import { useApiResource } from '@/hooks/useApiResource';
import { apiFetch } from '@/lib/api';
import { studentBadgeDetails } from '@/lib/badge';
import { ROUTES, studentRoute } from '@/lib/routes';

type Props = {
  /** One id: a single badge. Several: a sheet of badges. */
  ids: string[];
};

// Preview and print the ID badge / library card of one student or several.
// Printing is recorded first, because a lost-card replacement may carry a fee.
export function StudentBadgeView({ ids }: Props) {
  const single = ids.length === 1;
  const { data, error, loading, reload } = useApiResource(
    ids.length > 0
      ? `/people/students/badges?ids=${encodeURIComponent(ids.join(','))}`
      : null,
    StudentBadgeListSchema,
  );
  const [printError, setPrintError] = useState('');
  const [busy, setBusy] = useState(false);

  async function print() {
    if (!data || data.length === 0) return;
    setBusy(true);
    setPrintError('');
    try {
      await apiFetch('/people/students/badge-print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: data.map((badge) => badge.id) }),
      });
      window.print();
    } catch (cause) {
      setPrintError(
        cause instanceof Error
          ? cause.message
          : 'Could not record the print. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (ids.length === 0) {
    return (
      <EmptyState
        heading="No students chosen"
        description="Select students in the Students list, then choose Print badges."
      />
    );
  }
  if (loading && !data) return <LoadingSkeleton variant="section" />;
  if (!data)
    return <ErrorState variant="section" message={error} onRetry={reload} />;
  if (data.length === 0) {
    return (
      <EmptyState
        heading="Student not found"
        description="You may not have access to this student."
      />
    );
  }

  const missingPhoto = data.filter((badge) => !badge.photoUrl).length;

  return (
    <div className="flex flex-col gap-space-6">
      <PageHeader
        back={
          single
            ? { href: studentRoute(data[0].id), label: 'Back to profile' }
            : { href: ROUTES.students, label: 'Back to Students' }
        }
        title={single ? 'Badge preview' : `Print ${data.length} badges`}
        description="ID badge and library card, printed at real size."
        actions={
          <Button onClick={() => void print()} loading={busy}>
            Print
          </Button>
        }
      />

      {printError && <Alert variant="error">{printError}</Alert>}
      {missingPhoto > 0 && (
        <Alert variant="warning">
          {missingPhoto === 1
            ? '1 student has'
            : `${missingPhoto} students have`}{' '}
          no photo. Their badge will show initials.
        </Alert>
      )}

      <PrintSheet columns={single ? 1 : 2}>
        {data.map((badge) => (
          <IdCardFlat
            key={badge.id}
            details={studentBadgeDetails(badge)}
            photoUrl={badge.photoUrl}
          />
        ))}
      </PrintSheet>

      <Text variant="body-sm" color="muted">
        Each card prints at 85.6 × 54 mm, the size of a bank card. In the print
        window, set Scale to 100% and turn on Background graphics. To keep a PDF
        instead of printing on paper, choose &ldquo;Save as PDF&rdquo; as the
        printer.
      </Text>
    </div>
  );
}
