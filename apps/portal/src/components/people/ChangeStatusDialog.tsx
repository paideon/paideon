'use client';

import { useEffect, useState } from 'react';
import {
  ChangeStudentStatusSchema,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_VALUES,
  type ChangeStudentStatusResultData,
  type StudentStatusEnumData,
} from '@paideon/contracts';
import { Input, Modal, Select, Textarea } from '@paideon/ui';

import { ApiError, apiFetch } from '@/lib/api';
import { fieldErrors } from '@/lib/form-errors';

type Props = {
  open: boolean;
  studentId: string;
  studentName: string;
  currentStatus: StudentStatusEnumData;
  onClose: () => void;
  onDone: (result: ChangeStudentStatusResultData) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

// Records that a student transferred out, left, graduated or came back.
export function ChangeStatusDialog({
  open,
  studentId,
  studentName,
  currentStatus,
  onClose,
  onDone,
}: Props) {
  const choices = STUDENT_STATUS_VALUES.filter(
    (status) => status !== currentStatus,
  );
  const [status, setStatus] = useState<StudentStatusEnumData>(choices[0]);
  const [effectiveDate, setEffectiveDate] = useState(today());
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus(choices[0]);
      setEffectiveDate(today());
      setReason('');
      setErrors({});
      setBusy(false);
    }
    // `choices` follows `currentStatus`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStatus]);

  async function submit() {
    if (busy) return;
    const parsed = ChangeStudentStatusSchema.safeParse({
      status,
      effectiveDate,
      reason,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const result = await apiFetch<ChangeStudentStatusResultData>(
        `/people/students/${encodeURIComponent(studentId)}/status`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        },
      );
      onDone(result);
      onClose();
    } catch (cause) {
      setBusy(false);
      setErrors(
        cause instanceof ApiError && cause.fieldErrors
          ? cause.fieldErrors
          : {
              _form:
                cause instanceof Error
                  ? cause.message
                  : 'Something went wrong. Try again.',
            },
      );
    }
  }

  return (
    <Modal
      variant="confirmation"
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      title="Change status"
      description={`Record what happened to ${studentName}.`}
      confirmLabel={busy ? 'Saving…' : 'Save status'}
      confirmDisabled={busy}
      closeOnConfirm={false}
      onConfirm={() => void submit()}
    >
      <div className="flex flex-col gap-space-4">
        <Select
          label="New status"
          value={status}
          error={errors.status}
          onChange={(event) =>
            setStatus(event.target.value as StudentStatusEnumData)
          }
          options={choices.map((value) => ({
            value,
            label: STUDENT_STATUS_LABELS[value],
          }))}
        />
        <Input
          label="Effective date"
          type="date"
          value={effectiveDate}
          error={errors.effectiveDate}
          onChange={(event) => setEffectiveDate(event.target.value)}
        />
        <Textarea
          label="Reason (optional)"
          rows={3}
          value={reason}
          error={errors.reason}
          onChange={(event) => setReason(event.target.value)}
        />
        {status !== 'ACTIVE' && (
          <p className="font-body text-body-sm text-text-muted">
            The student will no longer be able to sign in or borrow books.
          </p>
        )}
        {errors._form && (
          <p
            role="alert"
            className="font-body text-body-sm text-semantic-error-base"
          >
            {errors._form}
          </p>
        )}
      </div>
    </Modal>
  );
}
