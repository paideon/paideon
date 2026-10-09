'use client';

import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type CheckoutResult = { message: string };

export default function CheckoutPage() {
  const memberInput = useRef<HTMLInputElement>(null);
  const copyInput = useRef<HTMLInputElement>(null);
  const [memberBarcode, setMemberBarcode] = useState('');
  const [copyBarcode, setCopyBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  function onMemberKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      copyInput.current?.focus();
    }
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberBarcode.trim() || !copyBarcode.trim() || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await apiFetch<CheckoutResult>(
        '/library/circulation/checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberBarcode: memberBarcode.trim(),
            copyBarcode: copyBarcode.trim(),
          }),
        },
      );
      setError(false);
      setMessage(result.message);
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : 'Checkout failed.');
    } finally {
      setMemberBarcode('');
      setCopyBarcode('');
      setBusy(false);
      memberInput.current?.focus();
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-5 p-6">
      <Link className="underline" href="/librarian">
        Back to library
      </Link>
      <h1 className="text-2xl font-bold">Check out a book</h1>
      <form onSubmit={checkout} className="space-y-4">
        <label className="block">
          <span className="mb-1 block">Student/member card</span>
          <input
            ref={memberInput}
            autoFocus
            autoComplete="off"
            className="w-full rounded border p-3 text-lg"
            value={memberBarcode}
            onChange={(event) => setMemberBarcode(event.target.value)}
            onKeyDown={onMemberKey}
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Book copy barcode</span>
          <input
            ref={copyInput}
            autoComplete="off"
            className="w-full rounded border p-3 text-lg"
            value={copyBarcode}
            onChange={(event) => setCopyBarcode(event.target.value)}
          />
        </label>
        <button
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          {busy ? 'Checking out…' : 'Check out'}
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
