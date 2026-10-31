'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ResetPasswordSchema } from '@paideon/contracts';
import {
  Button,
  FormErrorMessage,
  InlineLink,
  PasswordInput,
  Text,
} from '@paideon/ui';

import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';
import { ROUTES } from '@/lib/routes';

import { PasswordRules } from './PasswordRules';

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [linkProblem, setLinkProblem] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setLinkProblem(false);

    const parsed = ResetPasswordSchema.safeParse({
      token,
      newPassword,
      confirmPassword,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      // Back to the sign-in page with a success message (?reset=1).
      router.replace(`${ROUTES.login}?reset=1`);
    } catch (cause) {
      setLoading(false);
      if (cause instanceof ApiError && cause.status === 400) {
        // Bad, expired or already-used link.
        setLinkProblem(true);
        setFormError(cause.message);
      } else if (cause instanceof ApiError && cause.status === 429) {
        setFormError('Too many attempts. Please wait a minute and try again.');
      } else {
        setFormError(
          'Could not reach the server. Check your connection and try again.',
        );
      }
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-space-5">
      <PasswordInput
        label="New password"
        name="newPassword"
        autoComplete="new-password"
        autoFocus
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword}
      />
      <PasswordRules password={newPassword} />
      <PasswordInput
        label="Confirm new password"
        name="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />
      {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
      {linkProblem && (
        <Text variant="body-sm">
          <InlineLink href={ROUTES.forgotPassword}>
            Request a new link
          </InlineLink>
        </Text>
      )}
      <Button type="submit" fullWidth loading={loading} loadingText="Saving">
        Set new password
      </Button>
    </form>
  );
}
