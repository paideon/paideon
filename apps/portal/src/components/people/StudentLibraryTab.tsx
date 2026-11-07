'use client';

import { StudentLibrarySchema, fineBalance } from '@paideon/contracts';
import { ErrorState, Heading, LoadingSkeleton } from '@paideon/ui';

import { MyFinesTable } from '@/components/library/MyFinesTable';
import { MyLoansTable } from '@/components/library/MyLoansTable';
import { useApiResource } from '@/hooks/useApiResource';
import { formatLKR } from '@/lib/format';

// What one student has borrowed. Needs library.members.read.
export function StudentLibraryTab({ studentId }: { studentId: string }) {
  const { data, error, loading, reload } = useApiResource(
    `/people/students/${encodeURIComponent(studentId)}/library`,
    StudentLibrarySchema,
  );
  if (loading && !data)
    return <LoadingSkeleton variant="table-row" count={3} />;
  if (!data) return <ErrorState message={error} onRetry={reload} />;

  const owed = data.fines.reduce((sum, fine) => sum + fineBalance(fine), 0);

  return (
    <div className="flex flex-col gap-space-8">
      <section className="flex flex-col gap-space-3">
        <Heading as="h2" level="h4">
          Borrowed now
        </Heading>
        <MyLoansTable
          loans={data.current}
          mode="current"
          emptyMessage="No books out right now."
        />
      </section>
      <section className="flex flex-col gap-space-3">
        <Heading as="h2" level="h4">
          Fines{owed > 0 ? ` (${formatLKR(owed)} owing)` : ''}
        </Heading>
        <MyFinesTable fines={data.fines} about="student" />
      </section>
      <section className="flex flex-col gap-space-3">
        <Heading as="h2" level="h4">
          Recently returned
        </Heading>
        <MyLoansTable
          loans={data.history}
          mode="history"
          emptyMessage="No returned books yet."
        />
      </section>
    </div>
  );
}
