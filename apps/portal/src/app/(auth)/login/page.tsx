'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell, Button, InlineLink, Text } from '@paideon/ui';

import { ActivationRequestForm } from '@/components/auth/ActivationRequestForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { apiFetch, type CurrentUser } from '@/lib/api';
import { postLoginPath } from '@/lib/routes';

type Mode = 'login' | 'activate';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [activationEmail, setActivationEmail] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);

  // Already signed in? Skip the form.
  useEffect(() => {
    let active = true;
    apiFetch<CurrentUser>('/auth/me')
      .then((user) => {
        if (active) router.replace(postLoginPath(user));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [router]);

  function showActivation(email = '', fromLoginAttempt = false) {
    setActivationEmail(email);
    setPendingNotice(fromLoginAttempt);
    setMode('activate');
  }

  if (mode === 'activate') {
    return (
      <AuthShell
        title="Activate your account"
        subtitle={
          pendingNotice
            ? "Your account hasn't been activated yet. Enter your school email and we'll send you an activation link."
            : "Enter your school email and we'll send you a link to set your password."
        }
        tagline="C.W.W. Kannangara Central College"
      >
        <ActivationRequestForm
          initialEmail={activationEmail}
          onBack={() => setMode('login')}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Use your school email or Paideon ID."
      tagline="C.W.W. Kannangara Central College"
      footer={
        <>
          <Text variant="body-sm">
            <InlineLink href="/forgot-password">Forgot password?</InlineLink>
          </Text>
          <Text variant="body-sm" color="muted">
            First time here?{' '}
            <Button variant="link" size="sm" onClick={() => showActivation()}>
              Activate your account
            </Button>
          </Text>
        </>
      }
    >
      <LoginForm onNeedsActivation={(email) => showActivation(email, true)} />
    </AuthShell>
  );
}
