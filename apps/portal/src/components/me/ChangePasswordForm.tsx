'use client';

import { useState, type FormEvent } from 'react';
import { ChangePasswordSchema } from '@paideon/contracts';
import {
  Alert,
  Button,
  FormErrorMessage,
  FormSectionWrapper,
  PasswordInput,
} from '@paideon/ui';

import { PasswordRules } from '@/components/auth/PasswordRules';
import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setDone(false);

    const parsed = ChangePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDone(true);
    } catch (cause) {
      if (
        cause instanceof ApiError &&
        cause.code === 'WRONG_CURRENT_PASSWORD'
      ) {
        setErrors({ currentPassword: cause.message });
      } else if (cause instanceof ApiError && cause.status === 429) {
        setFormError('Too many attempts. Please wait a minute and try again.');
      } else {
        setFormError(
          cause instanceof ApiError
            ? cause.message
            : 'Could not reach the server. Check your connection and try again.',
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FormSectionWrapper
        title="Change password"
        description="You will stay signed in here. Everywhere else is signed out."
      >
        <PasswordInput
          label="Current password"
          name="currentPassword"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
        />
        <PasswordInput
          label="New password"
          name="newPassword"
          autoComplete="new-password"
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
        {done && <Alert variant="success">Your password was changed.</Alert>}
        <div>
          <Button type="submit" loading={saving} loadingText="Saving">
            Change password
          </Button>
        </div>
      </FormSectionWrapper>
    </form>
  );
}
