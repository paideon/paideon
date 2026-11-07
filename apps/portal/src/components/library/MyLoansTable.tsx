'use client';

import { isLoanOverdue, type LoanSummaryData } from '@paideon/contracts';
import { Badge, DataTable } from '@paideon/ui';

import { dueText, formatDate } from '@/lib/format';

type Row = {
  id: string;
  book: string;
  authors: string;
  code: string;
  borrowed: string;
  due: string;
  returned: string;
  overdue: boolean;
  dueNote: string;
  status: string;
};

const STATUS_TEXT: Record<LoanSummaryData['status'], string> = {
  ACTIVE: 'Borrowed',
  RENEWED: 'Borrowed',
  OVERDUE: 'Overdue',
  RETURNED: 'Returned',
  LOST: 'Lost',
};

function toRow(loan: LoanSummaryData, now: Date): Row {
  const overdue = isLoanOverdue(loan, now);
  return {
    id: loan.id,
    book: loan.copy.book.title,
    authors: loan.copy.book.authors.join(', '),
    code: loan.copy.code,
    borrowed: formatDate(loan.checkoutDate),
    due: formatDate(loan.dueDate),
    returned: loan.returnDate ? formatDate(loan.returnDate) : '—',
    overdue,
    dueNote: loan.returnDate ? '' : dueText(loan.dueDate, now),
    status: STATUS_TEXT[loan.status],
  };
}

const bookColumn = {
  key: 'book' as const,
  header: 'Book',
  render: (value: Row[keyof Row], row: Row) => (
    <span className="flex flex-col">
      <span className="text-text-primary">{String(value)}</span>
      {row.authors && (
        <span className="text-body-sm text-text-muted">{row.authors}</span>
      )}
    </span>
  ),
};

export function MyLoansTable({
  loans,
  mode,
  emptyMessage,
}: {
  loans: LoanSummaryData[];
  /** "current": books still out, with due dates. "history": returned books. */
  mode: 'current' | 'history';
  /** Replaces the "You have..." text when the list is about someone else. */
  emptyMessage?: string;
}) {
  const now = new Date();
  const rows = loans.map((loan) => toRow(loan, now));

  if (mode === 'history') {
    return (
      <DataTable<Row>
        getRowKey={(row) => row.id}
        data={rows}
        emptyMessage={emptyMessage ?? 'You have not returned any books yet.'}
        columns={[
          bookColumn,
          { key: 'borrowed', header: 'Borrowed' },
          { key: 'returned', header: 'Returned' },
          { key: 'status', header: 'Outcome' },
        ]}
      />
    );
  }

  return (
    <DataTable<Row>
      getRowKey={(row) => row.id}
      data={rows}
      emptyMessage={emptyMessage ?? 'You have no books out right now.'}
      columns={[
        bookColumn,
        { key: 'code', header: 'Barcode' },
        { key: 'due', header: 'Due date' },
        {
          key: 'dueNote',
          header: 'Status',
          render: (value, row) =>
            row.overdue ? (
              <Badge
                variant="category"
                label={String(value)}
                className="bg-semantic-error-surface text-semantic-error-base"
              />
            ) : (
              <span className="text-text-muted">{String(value)}</span>
            ),
        },
      ]}
    />
  );
}
