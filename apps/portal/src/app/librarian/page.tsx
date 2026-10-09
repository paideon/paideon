'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoutButton } from '@/components/library/LogoutButton';
import { apiFetch } from '@/lib/api';

type Stats = {
  books: number;
  copies: number;
  activeLoans: number;
  overdueCount: number;
  loansToday: number;
};

const links = [
  ['Checkout', '/librarian/checkout'],
  ['Return', '/librarian/return'],
  ['Books', '/librarian/books'],
  ['Members and fines', '/librarian/members'],
  ['Overdue', '/librarian/overdue'],
];

export default function LibrarianHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Stats>('/library/reports/stats')
      .then(setStats)
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error ? cause.message : 'Unable to load statistics.',
        ),
      );
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">Library circulation</h1>
        <LogoutButton />
      </header>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {stats && (
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.entries({
            Books: stats.books,
            Copies: stats.copies,
            'Active loans': stats.activeLoans,
            Overdue: stats.overdueCount,
            'Loans today': stats.loansToday,
          }).map(([label, value]) => (
            <div className="rounded border p-3" key={label}>
              <dt>{label}</dt>
              <dd className="text-2xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <nav>
        <ul className="list-inside list-disc space-y-2">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link className="underline" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
