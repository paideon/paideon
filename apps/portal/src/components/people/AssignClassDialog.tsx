'use client';

import { useEffect, useState } from 'react';
import type { AssignClassResultData } from '@paideon/contracts';
import { Modal } from '@paideon/ui';

import { ClassPicker } from '@/components/common/ClassPicker';
import { apiFetch } from '@/lib/api';

type Props = {
  open: boolean;
  studentIds: string[];
  onClose: () => void;
  onDone: (result: AssignClassResultData) => void;
};

// Moves the chosen students into one class of the current year. Students
// whose grade does not match the class are skipped, and the answer says so.
export function AssignClassDialog({
  open,
  studentIds,
  onClose,
  onDone,
}: Props) {
  const [classId, setClassId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setClassId(null);
      setBusy(false);
      setError('');
    }
  }, [open]);

  async function submit() {
    if (!classId || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await apiFetch<AssignClassResultData>(
        '/people/students/assign-class',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentIds, classId }),
        },
      );
      onDone(result);
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Something went wrong. Try again.',
      );
      setBusy(false);
    }
  }

  return (
    <Modal
      variant="confirmation"
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      title="Assign class"
      description={`Put ${studentIds.length} selected ${
        studentIds.length === 1 ? 'student' : 'students'
      } in one class. A student can only join a class of their own grade.`}
      confirmLabel={busy ? 'Working…' : 'Assign'}
      confirmDisabled={!classId || busy}
      closeOnConfirm={false}
      onConfirm={() => void submit()}
    >
      <div className="flex flex-col gap-space-3">
        <ClassPicker value={classId} onChange={setClassId} required />
        {error && (
          <p
            role="alert"
            className="font-body text-body-sm text-semantic-error-base"
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
