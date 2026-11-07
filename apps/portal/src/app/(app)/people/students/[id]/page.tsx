import { Suspense } from 'react';
import { LoadingSkeleton } from '@paideon/ui';

import { RequireCapability } from '@/components/common/RequireCapability';
import { StudentProfile } from '@/components/people/StudentProfile';

export const metadata = { title: 'Student · Paideon' };

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireCapability capability="people.read">
      <Suspense fallback={<LoadingSkeleton variant="section" />}>
        <StudentProfile id={id} />
      </Suspense>
    </RequireCapability>
  );
}
