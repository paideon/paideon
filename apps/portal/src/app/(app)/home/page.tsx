'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heading, PageHeader, Text } from '@paideon/ui';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { apiFetch } from '@/lib/api';
import { navFor } from '@/lib/nav';

type Loan = {
  id: string;
  dueDate: string;
  copy: {
    code: string;
    book: { title: string; authors: string[] };
  };
};

export default function HomePage() {
  const user = useCurrentUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState('');

  // /library/me/loans is for students only. Asking it as anyone else is
  // refused by the API, which used to show every non-student an error here.
  const isStudent = user.role === 'STUDENT';

  useEffect(() => {
    if (!isStudent) return;
    apiFetch<Loan[]>('/library/me/loans')
      .then(setLoans)
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error ? cause.message : 'Unable to load your loans.',
        );
      });
  }, [isStudent]);

  const { tiles } = navFor(user);
  const name = user.displayName || `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-col gap-space-8">
      <PageHeader
        title="Home"
        description={`Signed in as ${name} (${user.paideonId})`}
      />

      <nav aria-label="Your tools">
        <ul className="m-space-0 grid list-none gap-space-3 p-space-0 md:grid-cols-2">
          {tiles.map((tile) => (
            <li key={tile.href}>
              <Link
                href={tile.href}
                className="flex h-full flex-col gap-space-1 rounded-md border border-border-light bg-surface-elevated p-space-4 transition-colors duration-fast hover:border-gold-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base"
              >
                <span className="font-body text-body font-semibold text-text-primary">
                  {tile.label}
                </span>
                <span className="font-body text-body-sm text-text-muted">
                  {tile.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isStudent && (
        <section className="flex flex-col gap-space-3">
          <Heading as="h2" level="h3">
            My current loans
          </Heading>
          {error && (
            <p role="alert" className="text-semantic-error-base">
              {error}
            </p>
          )}
          {loans.length === 0 ? (
            <Text color="muted">No current loans.</Text>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border border-border-light p-space-2">
                      Book
                    </th>
                    <th className="border border-border-light p-space-2">
                      Barcode
                    </th>
                    <th className="border border-border-light p-space-2">
                      Due date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="border border-border-light p-space-2">
                        {loan.copy.book.title} —{' '}
                        {loan.copy.book.authors.join(', ')}
                      </td>
                      <td className="border border-border-light p-space-2">
                        {loan.copy.code}
                      </td>
                      <td className="border border-border-light p-space-2">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
