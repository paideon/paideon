'use client';

import {
  MyFinesSchema,
  MyLoansSchema,
  fineBalance,
  type FineData,
} from '@paideon/contracts';
import { ErrorState, LoadingSkeleton, Tabs } from '@paideon/ui';

import { useApiResource, type ApiResource } from '@/hooks/useApiResource';

import { MyFinesTable } from './MyFinesTable';
import { MyLoansTable } from './MyLoansTable';

function CurrentTab() {
  const { data, error, loading, reload } = useApiResource(
    '/library/me/loans',
    MyLoansSchema,
  );
  if (loading && !data)
    return <LoadingSkeleton variant="table-row" count={3} />;
  if (!data) return <ErrorState message={error} onRetry={reload} />;
  return <MyLoansTable loans={data} mode="current" />;
}

function FinesTab({ resource }: { resource: ApiResource<FineData[]> }) {
  const { data, error, loading, reload } = resource;
  if (loading && !data)
    return <LoadingSkeleton variant="table-row" count={3} />;
  if (!data) return <ErrorState message={error} onRetry={reload} />;
  return <MyFinesTable fines={data} />;
}

function HistoryTab() {
  const { data, error, loading, reload } = useApiResource(
    '/library/me/loans?scope=history',
    MyLoansSchema,
  );
  if (loading && !data)
    return <LoadingSkeleton variant="table-row" count={3} />;
  if (!data) return <ErrorState message={error} onRetry={reload} />;
  return <MyLoansTable loans={data} mode="history" />;
}

export function MyLibrary() {
  // Loaded here, not in the tab, so the Fines tab can show how many are owing before it is opened.
  const fines = useApiResource('/library/me/fines', MyFinesSchema);
  const owing = (fines.data ?? []).filter(
    (fine) => fineBalance(fine) > 0,
  ).length;

  return (
    <Tabs
      tabs={[
        { id: 'current', label: 'Borrowed now', content: <CurrentTab /> },
        {
          id: 'fines',
          label: 'Fines',
          badge: owing || undefined,
          content: <FinesTab resource={fines} />,
        },
        { id: 'history', label: 'History', content: <HistoryTab /> },
      ]}
    />
  );
}
