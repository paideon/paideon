'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FormErrorMessage } from '@paideon/ui';

import { logout } from '@/lib/api';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    setError('');
    setLoading(true);
    try {
      await logout();
      router.replace('/login');
    } catch {
      // If the server could not revoke the session, stay here. Going to
      // /login would just sign the user straight back in via the cookie.
      setLoading(false);
      setError('Could not log out. Try again.');
    }
  }

  return (
    <div className="flex flex-col items-end gap-space-2">
      <Button
        variant="outline"
        size="sm"
        loading={loading}
        loadingText="Signing out"
        onClick={handleLogout}
      >
        Log out
      </Button>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
}
