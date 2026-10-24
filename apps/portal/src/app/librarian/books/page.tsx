'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

type Copy = { id: string; code: string; status: string };
type Book = {
  id: string;
  title: string;
  authors: string[];
  isbn13: string | null;
  categories: string[];
  copies: Copy[];
};
type BookResults = { data: Book[]; total: number };
type ImportResult = { created: number; skipped: number; errors: number };

export default function LibrarianBooksPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [copyCodes, setCopyCodes] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const result = await apiFetch<BookResults>(
        `/library/books?q=${encodeURIComponent(query)}&limit=100`,
      );
      setBooks(result.data);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to load books.',
      );
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      await apiFetch<Book>('/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, isbn, category }),
      });
      setTitle('');
      setAuthor('');
      setIsbn('');
      setCategory('');
      setNotice('Book added.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to add book.');
    }
  }

  async function addCopy(event: FormEvent<HTMLFormElement>, bookId: string) {
    event.preventDefault();
    const barcode = copyCodes[bookId]?.trim();
    if (!barcode) return;
    setError('');
    try {
      await apiFetch(`/library/books/${bookId}/copies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      });
      setCopyCodes((current) => ({ ...current, [bookId]: '' }));
      setNotice('Copy added.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to add copy.');
    }
  }

  async function importCsv(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('file');
    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      setError('Choose a CSV file first.');
      return;
    }
    setError('');
    setNotice('');
    const payload = new FormData();
    payload.append('file', input.files[0]);
    try {
      const result = await apiFetch<ImportResult>('/library/books/import', {
        method: 'POST',
        body: payload,
      });
      setNotice(
        `Import complete: ${result.created} created, ${result.skipped} skipped, ${result.errors} errors.`,
      );
      form.reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'CSV import failed.');
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <Link className="underline" href="/librarian">
        Back to library
      </Link>
      <h1 className="text-2xl font-bold">Books</h1>
      {error && (
        <p role="alert" className="text-semantic-error-base">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-semantic-success-base">
          {notice}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add a book</h2>
        <form onSubmit={addBook} className="grid gap-2 md:grid-cols-4">
          <input
            required
            className="rounded border p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            required
            className="rounded border p-2"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            className="rounded border p-2"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
          <input
            className="rounded border p-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            className="w-fit rounded bg-green-base px-4 py-2 text-text-inverse"
            type="submit"
          >
            Add book
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Import CSV</h2>
        <p>Columns: title, author, isbn, category, copies, starting barcode.</p>
        <form
          onSubmit={importCsv}
          className="flex flex-wrap items-center gap-2"
        >
          <input name="file" type="file" accept=".csv,text/csv" required />
          <button
            className="rounded bg-green-base px-4 py-2 text-text-inverse"
            type="submit"
          >
            Import
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Catalog</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
          className="flex gap-2"
        >
          <input
            className="min-w-0 flex-1 rounded border p-2"
            placeholder="Search title, author, ISBN or barcode"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="rounded border px-4" type="submit">
            Search
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="border p-2">Title / author</th>
                <th className="border p-2">ISBN / category</th>
                <th className="border p-2">Copies and add copy</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="border p-2">
                    {book.title}
                    <br />
                    {book.authors.join(', ')}
                  </td>
                  <td className="border p-2">
                    {book.isbn13 || '—'}
                    <br />
                    {book.categories.join(', ') || '—'}
                  </td>
                  <td className="border p-2">
                    <ul className="mb-2 list-inside list-disc">
                      {book.copies.map((copy) => (
                        <li key={copy.id}>
                          {copy.code} — {copy.status}
                        </li>
                      ))}
                    </ul>
                    <form
                      onSubmit={(event) => addCopy(event, book.id)}
                      className="flex gap-2"
                    >
                      <input
                        className="min-w-0 rounded border p-1"
                        aria-label={`New barcode for ${book.title}`}
                        placeholder="New copy barcode"
                        value={copyCodes[book.id] ?? ''}
                        onChange={(event) =>
                          setCopyCodes((current) => ({
                            ...current,
                            [book.id]: event.target.value,
                          }))
                        }
                      />
                      <button className="rounded border px-2" type="submit">
                        Add copy
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
