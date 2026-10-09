'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/api';

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function signOut() {
    setError('');
    try {
      await logout();
      router.replace('/login');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to log out.');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signOut}
        className="rounded border px-3 py-1"
      >
        Log out
      </button>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
