'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { CurrentUser } from '@/lib/api';

const CurrentUserContext = createContext<CurrentUser | null>(null);

/** Filled by AppFrame once /auth/me has answered; everything inside the shell can read it. */
export function CurrentUserProvider({
  user,
  children,
}: {
  user: CurrentUser;
  children: ReactNode;
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUser {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error('useCurrentUser must be used inside the signed-in shell.');
  }
  return user;
}
