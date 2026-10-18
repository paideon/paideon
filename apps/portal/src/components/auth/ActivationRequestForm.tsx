'use client';

import { useState, type FormEvent } from 'react';
import { RequestActivationSchema } from '@paideon/contracts';
import { Button, FormErrorMessage, Input, Text } from '@paideon/ui';

import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';

type Props = {
  initialEmail?: string;
  onBack: () => void;
};

export function ActivationRequestForm({ initialEmail = '', onBack }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const parsed = RequestActivationSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>('/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      // The API gives the same answer whether or not the email exists.
      setSentMessage(response.message);
    } catch (cause) {
      setFormError(
        cause instanceof ApiError
          ? cause.message
          : 'Could not reach the server. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (sentMessage) {
    return (
      <div className="flex flex-col gap-space-5">
        <Text>{sentMessage}</Text>
        <Text variant="body-sm" color="muted">
          The link works for 24 hours. If nothing arrives, check your spam
          folder.
        </Text>
        <Button variant="secondary" fullWidth onClick={onBack}>
          Back to log in
        </Button>
      </div>
    );
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
        Send my activation link
      </Button>
      <Button variant="link" onClick={onBack}>
        Back to log in
      </Button>
    </form>
  );
}
