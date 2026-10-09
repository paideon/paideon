'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type MemberSummary = {
  id: string;
  paideonId: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  role: string;
  status: string;
};
type Fine = {
  id: string;
  amountLKR: string | number;
  status: string;
  daysOverdue: number | null;
};
type MemberDetail = MemberSummary & {
  email: string;
  loans: Array<{
    id: string;
    dueDate: string;
    copy: { code: string; book: { title: string } };
  }>;
  fines: Fine[];
};

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function findMembers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMember(null);
    try {
      setMembers(
        await apiFetch<MemberSummary[]>(
          `/library/members?search=${encodeURIComponent(search)}`,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Member search failed.',
      );
    }
  }

  async function openMember(id: string) {
    setError('');
    try {
      setMember(
        await apiFetch<MemberDetail>(
          `/library/members/${encodeURIComponent(id)}`,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to load member.',
      );
    }
  }

  async function fineAction(fineId: string, action: 'pay' | 'waive') {
    setError('');
    setMessage('');
    try {
      await apiFetch(`/library/fines/${fineId}/${action}`, {
        method: 'PATCH',
        ...(action === 'waive'
          ? {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reason }),
            }
          : {}),
      });
      setMessage(action === 'pay' ? 'Fine marked as paid.' : 'Fine waived.');
      if (member) await openMember(member.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Fine update failed.');
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 p-6">
      <Link className="underline" href="/librarian">
        Back to library
      </Link>
      <h1 className="text-2xl font-bold">Members and fines</h1>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-green-700">
          {message}
        </p>
      )}
      <form onSubmit={findMembers} className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded border p-2"
          placeholder="Card barcode, Paideon ID or name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-white"
          type="submit"
        >
          Search
        </button>
      </form>
      {members.length > 0 && (
        <ul className="space-y-2">
          {members.map((item) => (
            <li key={item.id}>
              <button
                className="text-left underline"
                onClick={() => openMember(item.id)}
                type="button"
              >
                {item.firstName} {item.lastName} — {item.paideonId} — card{' '}
                {item.cardNumber} ({item.status})
              </button>
            </li>
          ))}
        </ul>
      )}
      {member && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {member.firstName} {member.lastName} — {member.cardNumber}
          </h2>
          <p>
            {member.email} · {member.paideonId} · {member.role} ·{' '}
            {member.status}
          </p>
          <div>
            <h3 className="font-semibold">Current loans</h3>
            {member.loans.length === 0 ? (
              <p>None</p>
            ) : (
              <ul className="list-inside list-disc">
                {member.loans.map((loan) => (
                  <li key={loan.id}>
                    {loan.copy.book.title} ({loan.copy.code}), due{' '}
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Unpaid fines</h3>
            {member.fines.length === 0 ? (
              <p>None</p>
            ) : (
              <ul className="space-y-2">
                {member.fines.map((fine) => (
                  <li
                    className="flex flex-wrap items-center gap-2"
                    key={fine.id}
                  >
                    Rs {Number(fine.amountLKR).toFixed(2)} —{' '}
                    {fine.daysOverdue ?? 0} overdue days
                    <button
                      className="rounded border px-2 py-1"
                      onClick={() => fineAction(fine.id, 'pay')}
                      type="button"
                    >
                      Mark paid
                    </button>
                    <input
                      className="rounded border p-1"
                      aria-label="Waiver reason"
                      placeholder="Waiver reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                    <button
                      className="rounded border px-2 py-1"
                      disabled={!reason.trim()}
                      onClick={() => fineAction(fine.id, 'waive')}
                      type="button"
                    >
                      Waive
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
