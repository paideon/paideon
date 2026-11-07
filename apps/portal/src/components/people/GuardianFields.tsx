'use client';

import {
  GUARDIAN_RELATIONSHIP_LABELS,
  GUARDIAN_RELATIONSHIP_VALUES,
} from '@paideon/contracts';
import { Input, Select } from '@paideon/ui';

import type { GuardianFormState } from '@/lib/student-form';

type Props = {
  /** Position in the list, used in the labels ("Guardian 2") and error keys. */
  index: number;
  value: GuardianFormState;
  onChange: (value: GuardianFormState) => void;
  errors: Record<string, string>;
  required?: boolean;
};

// Name, relationship and phone of one guardian.
export function GuardianFields({
  index,
  value,
  onChange,
  errors,
  required = false,
}: Props) {
  const prefix = `guardians.${index}`;
  const set = (changes: Partial<GuardianFormState>) =>
    onChange({ ...value, ...changes });

  return (
    <fieldset className="m-space-0 grid min-w-0 gap-space-4 border-0 p-space-0 sm:grid-cols-3">
      <legend className="mb-space-3 font-body text-label uppercase tracking-label text-text-muted">
        Guardian {index + 1}
        {!required && ' (optional)'}
      </legend>
      <Input
        label="Name"
        required={required}
        value={value.name}
        error={errors[`${prefix}.name`]}
        onChange={(event) => set({ name: event.target.value })}
        autoComplete="off"
      />
      <Select
        label="Relationship"
        required={required}
        value={value.relationship}
        error={errors[`${prefix}.relationship`]}
        onChange={(event) => set({ relationship: event.target.value })}
        options={[
          { value: '', label: 'Choose…' },
          ...GUARDIAN_RELATIONSHIP_VALUES.map((relationship) => ({
            value: relationship,
            label: GUARDIAN_RELATIONSHIP_LABELS[relationship],
          })),
        ]}
      />
      <Input
        label="Phone"
        type="tel"
        required={required}
        inputMode="tel"
        value={value.phone}
        error={errors[`${prefix}.phone`]}
        helperText="07x xxx xxxx or +94 7x xxx xxxx"
        onChange={(event) => set({ phone: event.target.value })}
        autoComplete="off"
      />
    </fieldset>
  );
}
