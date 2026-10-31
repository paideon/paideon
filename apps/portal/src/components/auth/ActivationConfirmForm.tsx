'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ActivationInfoSchema,
  ConfirmActivationSchema,
  type ActivationInfoData,
} from '@paideon/contracts';
import {
  Button,
  ErrorState,
  FormErrorMessage,
  PasswordInput,
  Text,
} from '@paideon/ui';

import {
  ApiError,
  apiFetch,
  fetchCurrentUser,
  setAccessToken,
} from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';
import { postLoginPath, ROUTES } from '@/lib/routes';

import { PasswordRules } from './PasswordRules';

type Lookup =
  | { state: 'loading' }
  | { state: 'ready'; info: ActivationInfoData }
  | { state: 'invalid' } // bad, expired or used link
  | { state: 'unreachable' }; // network or server problem: worth retrying

export function ActivationConfirmForm({ token }: { token: string }) {
  const router = useRouter();
  const [lookup, setLookup] = useState<Lookup>({ state: 'loading' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const check = useCallback(() => {
    setLookup({ state: 'loading' });
    // Asking who the link belongs to does not use the link up.
    apiFetch<unknown>(
      `/auth/activate/${encodeURIComponent(token)}`,
      {},
      { redirectOnAuthFailure: false },
    )
      .then((body) => {
        const info = ActivationInfoSchema.safeParse(body);
        setLookup(
          info.success
            ? { state: 'ready', info: info.data }
            : { state: 'unreachable' },
        );
      })
      .catch((cause: unknown) => {
        setLookup(
          cause instanceof ApiError && cause.status === 400
            ? { state: 'invalid' }
            : { state: 'unreachable' },
        );
      });
  }, [token]);

  useEffect(() => {
    check();
  }, [check]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const parsed = ConfirmActivationSchema.safeParse({
      token,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      // The API signs the person in as soon as the password is set.
      const response = await apiFetch<{ accessToken?: string }>(
        '/auth/activate/confirm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        },
      );
      if (!response.accessToken) {
        // Account is active but we were not handed a session: sign in normally.
        router.replace(ROUTES.login);
        return;
      }
      setAccessToken(response.accessToken);
      const user = await fetchCurrentUser();
      router.replace(postLoginPath(user));
    } catch (cause) {
      setLoading(false);
      if (cause instanceof ApiError && cause.status === 400) {
        // The link was used or expired between opening the page and now.
        setLookup({ state: 'invalid' });
      } else if (cause instanceof ApiError && cause.status === 429) {
        setFormError('Too many attempts. Please wait a minute and try again.');
      } else {
        setFormError(
          'Could not reach the server. Check your connection and try again.',
        );
      }
    }
  }

  if (lookup.state === 'loading') {
    return (
      <Text role="status" color="muted">
        Checking your link…
      </Text>
    );
  }

  if (lookup.state === 'invalid') {
    return (
      <ErrorState
        variant="section"
        message="This activation link is not valid. It may have expired or already been used."
        retryLabel="Request a new link"
        onRetry={() => router.push(ROUTES.loginActivate)}
      />
    );
  }

  if (lookup.state === 'unreachable') {
    return (
      <ErrorState
        variant="section"
        message="We could not check your link. Check your connection and try again."
        onRetry={check}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-space-5">
      <div className="flex flex-col gap-space-1 rounded-sm border border-border-light bg-surface-default p-space-4">
        <Text>
          {lookup.info.firstName} {lookup.info.lastName}
        </Text>
        <Text variant="body-sm" color="muted">
          {lookup.info.email}
        </Text>
      </div>
      <PasswordInput
        label="New password"
        name="password"
        autoComplete="new-password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />
      <PasswordRules password={password} confirm={confirmPassword} />
      {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
      <Button
        type="submit"
        fullWidth
        loading={loading}
        loadingText="Activating"
      >
        Activate my account
      </Button>
    </form>
  );
}
