import { Suspense } from 'react';
import { LoadingSkeleton } from '@paideon/ui';

import { RequireCapability } from '@/components/common/RequireCapability';
import { StudentsTable } from '@/components/people/StudentsTable';

export const metadata = { title: 'Students · Paideon' };

export default function StudentsPage() {
  return (
    <RequireCapability capability="people.read">
      {/* The list keeps its filters in the address, which needs a Suspense boundary. */}
      <Suspense fallback={<LoadingSkeleton variant="section" />}>
        <StudentsTable />
      </Suspense>
    </RequireCapability>
  );
}
