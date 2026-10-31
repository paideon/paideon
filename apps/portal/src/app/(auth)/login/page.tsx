import { Suspense } from 'react';

import { LoginView } from '@/components/auth/LoginView';

export const metadata = { title: 'Log in · Paideon' };

// useSearchParams() in LoginView needs a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
