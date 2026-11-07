import type { AuditEntryData } from '@paideon/contracts';

import { formatDateTime } from '@/lib/format';

const ACTION_LABELS: Record<string, string> = {
  'people.student.create': 'Record created',
  'people.student.update': 'Record updated',
  'people.student.status': 'Status changed',
  'people.student.photo': 'Photo changed',
  'people.student.badge.print': 'Badge printed',
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  nameWithInitials: 'Name with initials',
  nameLocal: 'Local-language name',
  nameLocalLanguage: 'Local-language name language',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  religion: 'Religion',
  ethnicity: 'Ethnicity',
  medium: 'Medium',
  admissionNumber: 'Admission number',
  admissionDate: 'Admission date',
  gradeAtAdmission: 'Grade at admission',
  currentGrade: 'Grade',
  class: 'Class',
  address: 'Address',
  guardians: 'Guardians',
  status: 'Status',
  effectiveDate: 'Effective date',
  reason: 'Reason',
};

const scalar = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') return 'empty';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  return null; // objects and lists: say the field changed, not how
};

function changeText(key: string, entry: AuditEntryData): string {
  const label = FIELD_LABELS[key] ?? key;
  const before = scalar(entry.before?.[key]);
  const after = scalar(entry.after?.[key]);
  if (
    entry.action === 'people.student.create' ||
    before === null ||
    after === null
  ) {
    return after !== null && entry.action === 'people.student.create'
      ? `${label}: ${after}`
      : label;
  }
  return `${label}: ${before} → ${after}`;
}

// A list of "who did what, when" for a person's record.
export function ActivityList({ entries }: { entries: AuditEntryData[] }) {
  return (
    <ol className="m-space-0 flex list-none flex-col p-space-0">
      {entries.map((entry) => {
        const by = entry.actor.name ?? entry.actor.paideonId ?? 'The system';
        return (
          <li
            key={entry.id}
            className="flex flex-col gap-space-1 border-b border-border-light py-space-3"
          >
            <span className="font-body text-body text-text-primary">
              {ACTION_LABELS[entry.action] ?? entry.action}
              <span className="text-text-muted"> by {by}</span>
            </span>
            <time
              dateTime={entry.createdAt}
              className="font-body text-caption text-text-muted"
            >
              {formatDateTime(entry.createdAt)}
            </time>
            {entry.changedFields.length > 0 && (
              <ul className="m-space-0 list-none p-space-0 font-body text-body-sm text-text-muted">
                {entry.changedFields.map((key) => (
                  <li key={key}>{changeText(key, entry)}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
