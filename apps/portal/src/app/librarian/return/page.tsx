'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type ReturnResult = {
  message: string;
  daysOverdue: number;
  fine: { amountLKR: string | number; daysOverdue: number } | null;
};

export default function ReturnPage() {
  const input = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!barcode.trim() || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await apiFetch<ReturnResult>(
        '/library/circulation/return',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ copyBarcode: barcode.trim() }),
        },
      );
      setError(false);
      setMessage(
        result.fine
          ? `${result.message} ${result.fine.daysOverdue} day(s) overdue; fine Rs ${Number(result.fine.amountLKR).toFixed(2)}.`
          : result.message,
      );
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : 'Return failed.');
    } finally {
      setBarcode('');
      setBusy(false);
      input.current?.focus();
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-5 p-6">
      <Link className="underline" href="/librarian">
        Back to library
      </Link>
      <h1 className="text-2xl font-bold">Return a book</h1>
      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={input}
          autoFocus
          autoComplete="off"
          aria-label="Book copy barcode"
          className="min-w-0 flex-1 rounded border p-3 text-lg"
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
        />
        <button
          className="rounded bg-slate-900 px-4 text-white"
          disabled={busy}
          type="submit"
        >
          Return
        </button>
      </form>
      {message && (
        <p role="status" className={error ? 'text-red-700' : 'text-green-700'}>
          {message}
        </p>
      )}
    </main>
  );
}
