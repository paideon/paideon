'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AuthShell, Button, InlineLink, Text } from '@paideon/ui';

import { SessionRedirect } from '@/components/common/SessionRedirect';
import { ROUTES, safeNext } from '@/lib/routes';

import { ActivationRequestForm } from './ActivationRequestForm';
import { LoginForm } from './LoginForm';

type Mode = 'login' | 'activate';

const SCHOOL = 'C.W.W. Kannangara Central College';

/**
 * Reads the URL: ?next= (where to go after signing in), ?mode=activate (open
 * on the activation request) and ?reset=1 (password was just changed).
 */
export function LoginView() {
  const params = useSearchParams();
  const next = params.get('next');
  const [mode, setMode] = useState<Mode>(
    params.get('mode') === 'activate' ? 'activate' : 'login',
  );
  const [activationEmail, setActivationEmail] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);
  const justReset = params.get('reset') === '1';

  function showActivation(email = '', fromLoginAttempt = false) {
    setActivationEmail(email);
    setPendingNotice(fromLoginAttempt);
    setMode('activate');
  }

  // Already signed in? Skip the form.
  const redirect = <SessionRedirect to={safeNext(next)} />;

  if (mode === 'activate') {
    return (
      <>
        {redirect}
        <AuthShell
          title="Activate your account"
          subtitle={
            pendingNotice
              ? "Your account hasn't been activated yet. Enter your school email and we'll send you an activation link."
              : "Enter your school email and we'll send you a link to set your password."
          }
          tagline={SCHOOL}
          footer={
            <Text variant="body-sm" color="muted">
              <InlineLink href={ROUTES.privacy}>Privacy notice</InlineLink>
            </Text>
          }
        >
          <ActivationRequestForm
            initialEmail={activationEmail}
            onBack={() => setMode('login')}
          />
        </AuthShell>
      </>
    );
  }

  return (
    <>
      {redirect}
      <AuthShell
        title="Log in"
        subtitle="Use your school email or Paideon ID."
        tagline={SCHOOL}
        footer={
          <>
            <Text variant="body-sm">
              <InlineLink href={ROUTES.forgotPassword}>
                Forgot password?
              </InlineLink>
            </Text>
            <Text variant="body-sm" color="muted">
              First time here?{' '}
              <Button variant="link" size="sm" onClick={() => showActivation()}>
                Activate your account
              </Button>
            </Text>
            <Text variant="body-sm" color="muted">
              <InlineLink href={ROUTES.privacy}>Privacy notice</InlineLink>
            </Text>
          </>
        }
      >
        {justReset && (
          <Alert variant="success">
            Your password was changed. Log in with your new password.
          </Alert>
        )}
        <LoginForm
          next={next}
          onNeedsActivation={(email) => showActivation(email, true)}
        />
      </AuthShell>
    </>
  );
}
