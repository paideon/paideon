'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { apiFetch, CurrentUser } from '@/lib/api';
import { tilesFor } from '@/lib/home-tiles';

type Loan = {
  id: string;
  dueDate: string;
  copy: {
    code: string;
    book: { title: string; authors: string[] };
  };
};

export default function HomePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<CurrentUser>('/auth/me'),
      apiFetch<Loan[]>('/library/me/loans'),
    ])
      .then(([currentUser, currentLoans]) => {
        setUser(currentUser);
        setLoans(currentLoans);
      })
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error ? cause.message : 'Unable to load your loans.',
        );
      });
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Home</h1>
          {user && (
            <p>
              Signed in as{' '}
              {user.displayName || `${user.firstName} ${user.lastName}`} (
              {user.paideonId})
            </p>
          )}
        </div>
        <div className="flex items-center gap-space-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      {user && (
        <nav aria-label="Your tools">
          <ul className="grid gap-3 md:grid-cols-2">
            {tilesFor(user).map((tile) => (
              <li key={tile.href}>
                <Link href={tile.href} className="block rounded border p-4">
                  <span className="font-semibold">{tile.label}</span>
                  <span className="block">{tile.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section>
        <h2 className="mb-2 text-xl font-semibold">My current loans</h2>
        {error && (
          <p role="alert" className="text-semantic-error-base">
            {error}
          </p>
        )}
        {loans.length === 0 ? (
          <p>No current loans.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="border p-2">Book</th>
                  <th className="border p-2">Barcode</th>
                  <th className="border p-2">Due date</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="border p-2">
                      {loan.copy.book.title} —{' '}
                      {loan.copy.book.authors.join(', ')}
                    </td>
                    <td className="border p-2">{loan.copy.code}</td>
                    <td className="border p-2">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
