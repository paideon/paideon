'use client';

import { fineBalance, type FineData } from '@paideon/contracts';
import { Alert, DataTable, Text } from '@paideon/ui';

import { formatDate, formatLKR } from '@/lib/format';

type Row = {
  id: string;
  book: string;
  reason: string;
  amount: string;
  paid: string;
  owed: string;
  status: string;
  date: string;
};

const REASON: Record<FineData['type'], string> = {
  OVERDUE: 'Returned late',
  DAMAGE: 'Damaged',
  LOST_BOOK: 'Lost',
};

const STATUS: Record<FineData['status'], string> = {
  PENDING: 'To pay',
  PARTIAL: 'Part paid',
  PAID: 'Paid',
  WAIVED: 'Waived',
};

export function MyFinesTable({ fines }: { fines: FineData[] }) {
  const totalOwed = fines.reduce((sum, fine) => sum + fineBalance(fine), 0);

  const rows: Row[] = fines.map((fine) => ({
    id: fine.id,
    book: fine.bookTitle,
    reason:
      fine.type === 'OVERDUE' && fine.daysOverdue
        ? `${REASON[fine.type]} (${fine.daysOverdue} days)`
        : REASON[fine.type],
    amount: formatLKR(fine.amountLKR),
    paid: formatLKR(fine.amountPaidLKR),
    owed: formatLKR(fineBalance(fine)),
    status: STATUS[fine.status],
    date: formatDate(fine.createdAt),
  }));

  return (
    <div className="flex flex-col gap-space-4">
      {totalOwed > 0 ? (
        <Alert variant="warning" title={`You owe ${formatLKR(totalOwed)}`}>
          Fines are paid at the library desk.
        </Alert>
      ) : (
        fines.length > 0 && <Text color="muted">You have no fines to pay.</Text>
      )}
      <DataTable<Row>
        getRowKey={(row) => row.id}
        data={rows}
        emptyMessage="You have no fines."
        columns={[
          { key: 'date', header: 'Date' },
          { key: 'book', header: 'Book' },
          { key: 'reason', header: 'Reason' },
          { key: 'amount', header: 'Fine' },
          { key: 'owed', header: 'Still owed' },
          { key: 'status', header: 'Status' },
        ]}
      />
    </div>
  );
}
