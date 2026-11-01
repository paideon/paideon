'use client';

import { useEffect, useId, useState } from 'react';

import { Input } from '../forms/Input';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  closeLabel?: string;
  /** Red styling for things that cannot be undone. */
  destructive?: boolean;
  /**
   * Ask the person to type this exact phrase before Confirm unlocks, for
   * actions that are hard to undo ("DELETE", a class name, ...).
   */
  typedConfirmation?: string;
  /**
   * Runs when Confirm is clicked. The dialog stays open and Confirm stays
   * disabled until it settles; if it throws, the message is shown and the
   * dialog stays open so the person can retry.
   */
  onConfirm: () => void | Promise<void>;
  errorMessage?: (error: unknown) => string;
}

const defaultError = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : 'Something went wrong. Try again.';

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  closeLabel,
  destructive = false,
  typedConfirmation,
  onConfirm,
  errorMessage = defaultError,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const errorId = useId();

  // Every opening starts fresh.
  useEffect(() => {
    if (open) {
      setTyped('');
      setBusy(false);
      setError('');
    }
  }, [open]);

  const phraseOk =
    typedConfirmation === undefined || typed === typedConfirmation;

  async function confirm() {
    if (busy || !phraseOk) return;
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(false);
    }
  }

  return (
    <Modal
      variant="confirmation"
      open={open}
      // Closing mid-request would hide a result the person is waiting for.
      onClose={() => {
        if (!busy) onClose();
      }}
      title={title}
      description={description}
      confirmLabel={busy ? 'Working…' : confirmLabel}
      closeLabel={closeLabel ?? 'Cancel'}
      destructive={destructive}
      confirmDisabled={busy || !phraseOk}
      closeOnConfirm={false}
      onConfirm={() => void confirm()}
    >
      {(typedConfirmation !== undefined || error) && (
        <div className="flex flex-col gap-space-3">
          {typedConfirmation !== undefined && (
            <Input
              label={`Type ${typedConfirmation} to confirm`}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
            />
          )}
          {error && (
            <p
              id={errorId}
              role="alert"
              className="font-body text-body-sm text-semantic-error-base"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';
