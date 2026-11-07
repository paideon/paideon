'use client';

import {
  GENDER_VALUES,
  MAX_GRADE,
  MEDIUM_VALUES,
  MIN_GRADE,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_VALUES,
  type StudentListQueryData,
} from '@paideon/contracts';
import { Checkbox, FilterPanel, Select } from '@paideon/ui';

import { ClassPicker } from '@/components/common/ClassPicker';
import { countStudentFilters } from '@/lib/student-query';

type Props = {
  query: StudentListQueryData;
  /** Change some filters; paging goes back to page 1. */
  onChange: (changes: Partial<StudentListQueryData>) => void;
  onClear: () => void;
};

const grades = Array.from(
  { length: MAX_GRADE - MIN_GRADE + 1 },
  (_, i) => MIN_GRADE + i,
);
const titleCase = (text: string) =>
  text.charAt(0) + text.slice(1).toLowerCase();

export function StudentFilters({ query, onChange, onClear }: Props) {
  return (
    <FilterPanel activeCount={countStudentFilters(query)} onClear={onClear}>
      <Select
        label="Grade"
        value={query.grade === undefined ? '' : String(query.grade)}
        onChange={(event) => {
          const grade =
            event.target.value === '' ? undefined : Number(event.target.value);
          // A class from another grade no longer fits.
          onChange({ grade, classId: undefined });
        }}
        options={[
          { value: '', label: 'All grades' },
          ...grades.map((grade) => ({
            value: String(grade),
            label: `Grade ${grade}`,
          })),
        ]}
      />
      <ClassPicker
        value={query.classId ?? null}
        grade={query.grade}
        onChange={(classId) => onChange({ classId: classId ?? undefined })}
      />
      <Select
        label="Medium"
        value={query.medium ?? ''}
        onChange={(event) =>
          onChange({
            medium: (event.target.value ||
              undefined) as StudentListQueryData['medium'],
          })
        }
        options={[
          { value: '', label: 'All media' },
          ...MEDIUM_VALUES.map((value) => ({ value, label: titleCase(value) })),
        ]}
      />
      <Select
        label="Gender"
        value={query.gender ?? ''}
        onChange={(event) =>
          onChange({
            gender: (event.target.value ||
              undefined) as StudentListQueryData['gender'],
          })
        }
        options={[
          { value: '', label: 'All' },
          ...GENDER_VALUES.map((value) => ({ value, label: titleCase(value) })),
        ]}
      />
      <Select
        label="Status"
        value={query.status}
        onChange={(event) =>
          onChange({
            status: event.target.value as StudentListQueryData['status'],
          })
        }
        options={[
          ...STUDENT_STATUS_VALUES.map((value) => ({
            value,
            label: STUDENT_STATUS_LABELS[value],
          })),
          { value: 'ALL', label: 'All statuses' },
        ]}
      />
      <Checkbox
        label="Missing photo"
        checked={query.missingPhoto === true}
        onChange={(event) =>
          onChange({ missingPhoto: event.target.checked || undefined })
        }
      />
      <Checkbox
        label="Missing guardian phone"
        checked={query.missingGuardianPhone === true}
        onChange={(event) =>
          onChange({ missingGuardianPhone: event.target.checked || undefined })
        }
      />
    </FilterPanel>
  );
}
