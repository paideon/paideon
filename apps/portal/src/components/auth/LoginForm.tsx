'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequestSchema } from '@paideon/contracts';
import { Button, FormErrorMessage, Input, PasswordInput } from '@paideon/ui';

import {
  ApiError,
  apiFetch,
  fetchCurrentUser,
  setAccessToken,
} from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';
import { postLoginPath } from '@/lib/routes';

type LoginResponse = {
  data?: { accessToken?: string };
  accessToken?: string;
};

type Props = {
  /** Called when the account exists but has not been activated yet. */
  onNeedsActivation: (email: string) => void;
  /** Page the person was heading to before being sent to sign in (from ?next=). */
  next?: string | null;
};

export function LoginForm({ onNeedsActivation, next }: Props) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    // Same schema the API uses, so typos are caught before any request.
    const parsed = LoginRequestSchema.safeParse({ identifier, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const token = response.accessToken ?? response.data?.accessToken;
      if (!token) throw new Error('The server did not return an access token.');
      setAccessToken(token);

      const user = await fetchCurrentUser();
      // Back to the page they came from (checked by safeNext), else /home.
      router.replace(postLoginPath(user, next)); // stay in the loading state while navigating
    } catch (cause) {
      setLoading(false);
      if (cause instanceof ApiError && cause.code === 'EMAIL_NOT_VERIFIED') {
        onNeedsActivation(identifier.includes('@') ? identifier.trim() : '');
      } else if (cause instanceof ApiError && cause.status === 429) {
        setFormError('Too many attempts. Please wait a minute and try again.');
      } else if (cause instanceof ApiError) {
        setFormError(cause.message);
      } else {
        setFormError(
          'Could not reach the server. Check your connection and try again.',
        );
      }
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-space-5">
      <Input
        label="Email or Paideon ID"
        name="identifier"
        autoComplete="username"
        autoFocus
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={errors.identifier}
      />
      <PasswordInput
        label="Password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
      <Button
        type="submit"
        fullWidth
        loading={loading}
        loadingText="Signing in"
      >
        Log in
      </Button>
    </form>
  );
}
