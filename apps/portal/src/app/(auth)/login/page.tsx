'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, CurrentUser, setAccessToken } from '@/lib/api';

type LoginResponse = {
  data?: { accessToken?: string };
  accessToken?: string;
};

function redirectForRole(
  user: CurrentUser,
  router: ReturnType<typeof useRouter>,
) {
  if (user.role === 'LIBRARIAN' || user.role === 'ADMIN') {
    router.replace('/librarian');
  } else if (user.role === 'STUDENT') {
    router.replace('/home');
  } else {
    throw new Error('This account does not have a library portal role.');
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch<CurrentUser>('/auth/me')
      .then((user) => {
        if (active) redirectForRole(user, router);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const token = response.accessToken ?? response.data?.accessToken;
      if (!token) throw new Error('The server did not return an access token.');
      setAccessToken(token);
      redirectForRole(await apiFetch<CurrentUser>('/auth/me'), router);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Library sign in</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block">Email or Paideon ID</span>
          <input
            autoComplete="username"
            autoFocus
            required
            className="w-full rounded border p-2"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Password</span>
          <input
            autoComplete="current-password"
            required
            type="password"
            className="w-full rounded border p-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
