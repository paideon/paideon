'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type OverdueLoan = {
  id: string;
  dueDate: string;
  user: { firstName: string; lastName: string; cardNumber: string };
  copy: { code: string; book: { title: string } };
};

export default function OverduePage() {
  const [loans, setLoans] = useState<OverdueLoan[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<OverdueLoan[]>('/library/reports/overdue')
      .then(setLoans)
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error
            ? cause.message
            : 'Unable to load overdue loans.',
        ),
      );
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-5 p-6">
      <Link className="underline" href="/librarian">
        Back to library
      </Link>
      <h1 className="text-2xl font-bold">Overdue books</h1>
      {error && (
        <p role="alert" className="text-semantic-error-base">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border p-2">Member</th>
              <th className="border p-2">Book</th>
              <th className="border p-2">Barcode</th>
              <th className="border p-2">Due date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td className="border p-2">
                  {loan.user.firstName} {loan.user.lastName} (
                  {loan.user.cardNumber})
                </td>
                <td className="border p-2">{loan.copy.book.title}</td>
                <td className="border p-2">{loan.copy.code}</td>
                <td className="border p-2">
                  {new Date(loan.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
