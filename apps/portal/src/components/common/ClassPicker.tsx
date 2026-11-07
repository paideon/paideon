'use client';

import { ClassListSchema } from '@paideon/contracts';
import { Combobox } from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';

type Props = {
  value: string | null;
  onChange: (classId: string | null) => void;
  /** Show only the classes of this grade. */
  grade?: number;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
};

// Choose a class of the current academic year, by typing "10-A" or part of it.
export function ClassPicker({
  value,
  onChange,
  grade,
  label = 'Class',
  error,
  helperText,
  required,
  disabled,
}: Props) {
  const {
    data,
    error: loadError,
    loading,
  } = useApiResource('/school/classes', ClassListSchema);

  const options = (data ?? [])
    .filter((klass) => grade === undefined || klass.grade === grade)
    .map((klass) => ({
      value: klass.id,
      label: klass.label,
      hint: `${klass.studentCount} students`,
    }));

  return (
    <Combobox
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={loading ? 'Loading classes…' : 'Type to find a class'}
      error={error}
      helperText={
        loadError
          ? 'Classes could not be loaded. Reload the page to try again.'
          : helperText
      }
      required={required}
      disabled={disabled}
      emptyMessage={
        grade === undefined
          ? 'No classes found.'
          : `No classes in Grade ${grade}.`
      }
    />
  );
}
