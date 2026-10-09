'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Book = {
  id: string;
  title: string;
  authors: string[];
  isbn13: string | null;
  copies: Array<{ id: string; code: string; status: string }>;
};

type Results = { data: Book[]; total: number };

export default function StudentBooksPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const result = await apiFetch<Results>(
        `/library/books?q=${encodeURIComponent(query)}`,
      );
      setBooks(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Search failed.');
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-6">
      <Link className="underline" href="/home">
        Back to my loans
      </Link>
      <h1 className="text-2xl font-bold">Search books</h1>
      <form onSubmit={search} className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded border p-2"
          aria-label="Search title, author, ISBN or barcode"
          placeholder="Title, author, ISBN or barcode"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-white"
          type="submit"
        >
          Search
        </button>
      </form>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">ISBN</th>
              <th className="border p-2">Available copies</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.authors.join(', ')}</td>
                <td className="border p-2">{book.isbn13 || '—'}</td>
                <td className="border p-2">
                  {
                    book.copies.filter((copy) => copy.status === 'AVAILABLE')
                      .length
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
