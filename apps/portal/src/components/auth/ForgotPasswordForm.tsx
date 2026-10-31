'use client';

import { useState, type FormEvent } from 'react';
import { ForgotPasswordSchema } from '@paideon/contracts';
import { Alert, Button, FormErrorMessage, Input } from '@paideon/ui';

import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';

// The same sentence whether or not the account exists, so this page cannot
// be used to find out who has an account. The text is fixed here on purpose
// instead of echoing whatever the server says.
const SENT_MESSAGE =
  'If that account exists, we have sent a password reset link to its email address. The link works for a limited time.';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const parsed = ForgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setSent(true);
    } catch (cause) {
      setFormError(
        cause instanceof ApiError && cause.status === 429
          ? 'Too many requests. Please wait a minute and try again.'
          : 'Could not send the request. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return <Alert variant="success">{SENT_MESSAGE}</Alert>;
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-space-5">
      <Input
        label="School email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
      <Button type="submit" fullWidth loading={loading} loadingText="Sending">
        Send reset link
      </Button>
    </form>
  );
}
