'use client';

import { useState } from 'react';
import { PREFER_NOT_TO_SAY } from '@paideon/contracts';
import { Input, Select } from '@paideon/ui';

import { isPresetChoice } from '@/lib/student-form';

const OTHER = '__other__';

type Props = {
  label: string;
  /** '' = not recorded, PREFER_NOT_TO_SAY, or the text itself. */
  value: string;
  onChange: (value: string) => void;
  presets: readonly string[];
  error?: string;
  helperText?: string;
};

// A choice from a short list, with "Other" for free text and an honest
// "Prefer not to say". Used for religion and ethnicity, which are optional.
export function OptionalChoiceField({
  label,
  value,
  onChange,
  presets,
  error,
  helperText,
}: Props) {
  const [otherMode, setOtherMode] = useState(!isPresetChoice(value, presets));
  const selectValue = otherMode ? OTHER : value;

  return (
    <div className="flex flex-col gap-space-3">
      <Select
        label={label}
        value={selectValue}
        error={otherMode ? undefined : error}
        helperText={helperText}
        onChange={(event) => {
          const next = event.target.value;
          if (next === OTHER) {
            setOtherMode(true);
            onChange('');
          } else {
            setOtherMode(false);
            onChange(next);
          }
        }}
        options={[
          { value: '', label: 'Not recorded' },
          ...presets.map((preset) => ({ value: preset, label: preset })),
          { value: OTHER, label: 'Other…' },
          { value: PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
        ]}
      />
      {otherMode && (
        <Input
          label={`${label} (other)`}
          value={value}
          error={error}
          onChange={(event) => onChange(event.target.value)}
          maxLength={60}
        />
      )}
    </div>
  );
}
