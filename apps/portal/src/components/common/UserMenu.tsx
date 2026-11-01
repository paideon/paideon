'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, DropdownMenu } from '@paideon/ui';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { logout } from '@/lib/api';
import { ROUTES } from '@/lib/routes';

export function UserMenu() {
  const user = useCurrentUser();
  const router = useRouter();
  const [error, setError] = useState('');
  const name = user.displayName || `${user.firstName} ${user.lastName}`;

  async function signOut() {
    setError('');
    try {
      await logout();
      router.replace(ROUTES.login);
    } catch {
      // The server could not end the session. Going to /login would just
      // sign the person straight back in through the cookie, so stay here.
      setError('Could not sign out. Try again.');
    }
  }

  return (
    <div className="relative">
      <DropdownMenu
        align="right"
        trigger={
          <>
            <Avatar name={name} src={user.photoUrl} size="xs" />
            <span className="hidden max-w-[10rem] truncate sm:inline">
              {name}
            </span>
          </>
        }
        items={[
          { id: 'account', label: 'My account', href: ROUTES.account },
          { id: 'sign-out', label: 'Sign out', onClick: () => void signOut() },
        ]}
      />
      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full z-dropdown mt-space-1 whitespace-nowrap rounded-sm border border-semantic-error-base bg-semantic-error-surface px-space-3 py-space-2 text-body-sm text-semantic-error-base"
        >
          {error}
        </p>
      )}
    </div>
  );
}
