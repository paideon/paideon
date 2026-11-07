'use client';

import { useState } from 'react';
import { AuditListSchema } from '@paideon/contracts';
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  Pagination,
} from '@paideon/ui';

import { ActivityList } from '@/components/common/ActivityList';
import { useApiResource } from '@/hooks/useApiResource';

// Who changed this student's record, and when.
export function StudentActivityTab({ studentId }: { studentId: string }) {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useApiResource(
    `/people/students/${encodeURIComponent(studentId)}/activity?page=${page}`,
    AuditListSchema,
  );
  if (loading && !data)
    return <LoadingSkeleton variant="table-row" count={4} />;
  if (!data) return <ErrorState message={error} onRetry={reload} />;
  if (data.total === 0) {
    return (
      <EmptyState
        heading="No activity yet"
        description="Changes to this record will appear here."
      />
    );
  }
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  return (
    <div className="flex flex-col gap-space-4">
      <ActivityList entries={data.items} />
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={data.page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
