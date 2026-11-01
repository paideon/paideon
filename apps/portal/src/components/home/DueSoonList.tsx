'use client';

import Link from 'next/link';
import { MyLoansSchema, isLoanOverdue } from '@paideon/contracts';
import { Badge, EmptyState, Heading, Text } from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { dueText, formatDate } from '@/lib/format';
import { ROUTES } from '@/lib/routes';

const SHOWN = 5;

// Books the person has out, soonest due first.
export function DueSoonList() {
  const { data, error, loading } = useApiResource(
    '/library/me/loans',
    MyLoansSchema,
  );
  const now = new Date();

  return (
    <section aria-labelledby="due-soon" className="flex flex-col gap-space-3">
      <Heading as="h2" level="h3" id="due-soon">
        Due soon
      </Heading>

      {error && (
        <p role="alert" className="text-semantic-error-base">
          {error}
        </p>
      )}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          heading="No books out"
          description="Books you borrow will show up here with their due dates."
        />
      )}

      {data && data.length > 0 && (
        <ul className="m-space-0 flex list-none flex-col p-space-0">
          {data.slice(0, SHOWN).map((loan) => (
            <li
              key={loan.id}
              className="flex flex-wrap items-center justify-between gap-space-2 border-b border-border-light py-space-3 last:border-b-0"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-text-primary">
                  {loan.copy.book.title}
                </span>
                <span className="text-body-sm text-text-muted">
                  Due {formatDate(loan.dueDate)}
                </span>
              </span>
              {isLoanOverdue(loan, now) ? (
                <Badge
                  variant="category"
                  label={dueText(loan.dueDate, now)}
                  className="bg-semantic-error-surface text-semantic-error-base"
                />
              ) : (
                <Text variant="body-sm" color="muted">
                  {dueText(loan.dueDate, now)}
                </Text>
              )}
            </li>
          ))}
        </ul>
      )}

      {data && data.length > SHOWN && (
        <Text variant="body-sm">
          <Link href={ROUTES.accountLibrary} className="underline">
            See all {data.length} books
          </Link>
        </Text>
      )}
    </section>
  );
}
