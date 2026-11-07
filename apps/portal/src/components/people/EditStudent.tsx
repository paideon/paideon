'use client';

import { StudentSchema } from '@paideon/contracts';
import { ErrorState, LoadingSkeleton } from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';

import { StudentForm } from './StudentForm';

// Loads the student, then shows the form with their details filled in.
export function EditStudent({ id }: { id: string }) {
  const { data, error, loading, reload } = useApiResource(
    `/people/students/${encodeURIComponent(id)}`,
    StudentSchema,
  );
  if (loading && !data) return <LoadingSkeleton variant="section" />;
  if (!data)
    return <ErrorState variant="section" message={error} onRetry={reload} />;
  return <StudentForm mode="edit" student={data} />;
}
