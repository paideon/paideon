'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  GUARDIAN_RELATIONSHIP_LABELS,
  StudentSchema,
  describeOptionalChoice,
  type ChangeStudentStatusResultData,
  type ClassHistoryEntryData,
  type GuardianData,
  type GuardianRelationshipEnumData,
  type StudentData,
} from '@paideon/contracts';
import {
  Alert,
  Avatar,
  Badge,
  DataTable,
  DropdownMenu,
  ErrorState,
  KeyValueList,
  LoadingSkeleton,
  PageHeader,
  Tabs,
} from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { can } from '@/lib/capabilities';
import { formatDate } from '@/lib/format';
import {
  ROUTES,
  studentBadgeRoute,
  studentEditRoute,
  studentPhotoRoute,
} from '@/lib/routes';

import { ChangeStatusDialog } from './ChangeStatusDialog';
import { StudentActivityTab } from './StudentActivityTab';
import { StudentLibraryTab } from './StudentLibraryTab';
import { StudentStatusBadge } from './StudentStatusBadge';

const titleCase = (text: string) =>
  text.charAt(0) + text.slice(1).toLowerCase();
const ACCOUNT_TEXT: Record<StudentData['accountStatus'], string> = {
  PENDING: 'Not activated yet',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Deactivated',
  GRADUATED: 'Graduated',
};

function Overview({ student }: { student: StudentData }) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const address = student.address
    ? [
        student.address.line1,
        student.address.line2,
        student.address.city,
        student.address.district,
      ]
        .filter(Boolean)
        .join(', ')
    : null;
  const localName = student.nameLocal
    ? `${student.nameLocal}${student.nameLocalLanguage ? ` (${titleCase(student.nameLocalLanguage)})` : ''}`
    : null;

  return (
    <div className="grid gap-space-8 lg:grid-cols-2">
      <section
        aria-labelledby="sec-identity"
        className="flex flex-col gap-space-2"
      >
        <h2
          id="sec-identity"
          className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base"
        >
          Identity
        </h2>
        <KeyValueList
          items={[
            { label: 'Full name', value: fullName },
            { label: 'Name with initials', value: student.nameWithInitials },
            { label: 'Sinhala or Tamil name', value: localName },
            { label: 'Date of birth', value: formatDate(student.dateOfBirth) },
            { label: 'Gender', value: titleCase(student.gender) },
          ]}
        />
      </section>

      <section
        aria-labelledby="sec-school"
        className="flex flex-col gap-space-2"
      >
        <h2
          id="sec-school"
          className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base"
        >
          School placement
        </h2>
        <KeyValueList
          items={[
            {
              label: 'Class this year',
              value: student.classLabel ?? 'Not placed in a class',
            },
            { label: 'Grade', value: `Grade ${student.grade}` },
            { label: 'Medium', value: titleCase(student.medium) },
            { label: 'Admission number', value: student.admissionNumber },
            {
              label: 'Admission date',
              value: formatDate(student.admissionDate),
            },
            {
              label: 'Grade at admission',
              value: `Grade ${student.gradeAtAdmission}`,
            },
          ]}
        />
      </section>

      <section
        aria-labelledby="sec-address"
        className="flex flex-col gap-space-2"
      >
        <h2
          id="sec-address"
          className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base"
        >
          Home address
        </h2>
        <KeyValueList items={[{ label: 'Address', value: address }]} />
      </section>

      {student.sensitiveVisible && (
        <section
          aria-labelledby="sec-background"
          className="flex flex-col gap-space-2"
        >
          <h2
            id="sec-background"
            className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base"
          >
            Background
          </h2>
          <KeyValueList
            items={[
              {
                label: 'Religion',
                value: describeOptionalChoice(student.religion),
              },
              {
                label: 'Ethnicity',
                value: describeOptionalChoice(student.ethnicity),
              },
            ]}
          />
        </section>
      )}

      <section
        aria-labelledby="sec-account"
        className="flex flex-col gap-space-2"
      >
        <h2
          id="sec-account"
          className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base"
        >
          Account
        </h2>
        <KeyValueList
          items={[
            { label: 'Paideon ID', value: student.paideonId },
            { label: 'Library card', value: student.cardNumber },
            { label: 'School email', value: student.email },
            { label: 'Account', value: ACCOUNT_TEXT[student.accountStatus] },
          ]}
        />
      </section>
    </div>
  );
}

type GuardianRow = GuardianData & { relationshipLabel: string };

function GuardiansTab({ student }: { student: StudentData }) {
  const rows: GuardianRow[] = student.guardians.map((guardian) => ({
    ...guardian,
    relationshipLabel:
      GUARDIAN_RELATIONSHIP_LABELS[
        guardian.relationship as GuardianRelationshipEnumData
      ] ?? guardian.relationship,
  }));
  return (
    <DataTable<GuardianRow>
      data={rows}
      getRowKey={(row) => row.id}
      emptyMessage="No guardians recorded."
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'relationshipLabel', header: 'Relationship' },
        {
          key: 'phone',
          header: 'Phone',
          render: (value) => (value ? String(value) : 'Not visible to you'),
        },
        {
          key: 'isPrimary',
          header: 'Main contact',
          render: (value) => (value ? 'Yes' : ''),
        },
      ]}
    />
  );
}

function ClassHistoryTab({ student }: { student: StudentData }) {
  return (
    <DataTable<ClassHistoryEntryData>
      data={student.classHistory}
      getRowKey={(row) => row.id}
      emptyMessage="This student has not been placed in a class yet."
      columns={[
        { key: 'academicYear', header: 'Year' },
        {
          key: 'grade',
          header: 'Class',
          render: (_v, row) => `${row.grade}-${row.section}`,
        },
        {
          key: 'enrolledAt',
          header: 'Joined',
          render: (value) => formatDate(String(value)),
        },
        {
          key: 'note',
          header: 'Note',
          render: (value) => (value ? String(value) : ''),
        },
      ]}
    />
  );
}

export function StudentProfile({ id }: { id: string }) {
  const user = useCurrentUser();
  const params = useSearchParams();
  const { data, error, loading, reload } = useApiResource(
    `/people/students/${encodeURIComponent(id)}`,
    StudentSchema,
  );
  const [changing, setChanging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (loading && !data) return <LoadingSkeleton variant="section" />;
  if (!data)
    return <ErrorState variant="section" message={error} onRetry={reload} />;

  const student = data;
  const name = `${student.firstName} ${student.lastName}`;
  const mayEdit = can(user, 'people.write');

  const items = [
    ...(mayEdit
      ? [{ id: 'edit', label: 'Edit', href: studentEditRoute(student.id) }]
      : []),
    ...(mayEdit
      ? [
          {
            id: 'photo',
            label: 'Take photo',
            href: studentPhotoRoute(student.id),
          },
        ]
      : []),
    { id: 'badge', label: 'Print badge', href: studentBadgeRoute(student.id) },
    ...(mayEdit
      ? [
          {
            id: 'status',
            label: 'Change status',
            onClick: () => setChanging(true),
          },
        ]
      : []),
  ];

  function statusChanged(result: ChangeStudentStatusResultData) {
    reload();
    setNotice(
      result.activeLoans > 0
        ? `Status saved. ${result.activeLoans} ${result.activeLoans === 1 ? 'book is' : 'books are'} still out: ask the library desk to collect ${result.activeLoans === 1 ? 'it' : 'them'}.`
        : 'Status saved.',
    );
  }

  return (
    <div className="flex flex-col gap-space-4">
      <PageHeader
        back={{ href: ROUTES.students, label: 'Back to Students' }}
        title={name}
        description={`${student.paideonId} · Admission no. ${student.admissionNumber}`}
        media={<Avatar name={name} src={student.photoUrl} size="lg" />}
        meta={
          <>
            <Badge
              variant="category"
              label={
                student.classLabel
                  ? `Class ${student.classLabel}`
                  : `Grade ${student.grade}, no class`
              }
            />
            <StudentStatusBadge status={student.status} />
          </>
        }
        actions={
          <DropdownMenu
            variant="filter"
            align="right"
            trigger="Actions"
            items={items}
          />
        }
      />

      {params.get('created') === '1' && (
        <Alert variant="success" title="Student added">
          {name} was saved.{' '}
          {mayEdit && (
            <Link className="underline" href={studentPhotoRoute(student.id)}>
              Take photo
            </Link>
          )}
        </Alert>
      )}
      {notice && <Alert variant="info">{notice}</Alert>}
      {student.missing.length > 0 && (
        <Alert variant="warning" title="Some details are missing">
          {student.missing.includes('PHOTO') && 'No photo yet. '}
          {student.missing.includes('GUARDIAN_PHONE') &&
            'No guardian phone number. '}
          {student.missing.includes('CLASS') && 'Not in a class this year.'}
          {mayEdit && (
            <>
              {' '}
              <Link className="underline" href={studentEditRoute(student.id)}>
                Edit record
              </Link>
            </>
          )}
        </Alert>
      )}

      <Tabs
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            content: <Overview student={student} />,
          },
          {
            id: 'guardians',
            label: 'Guardians',
            badge: student.guardians.length || undefined,
            content: <GuardiansTab student={student} />,
          },
          {
            id: 'classes',
            label: 'Class history',
            content: <ClassHistoryTab student={student} />,
          },
          ...(can(user, 'library.members.read')
            ? [
                {
                  id: 'library',
                  label: 'Library',
                  content: <StudentLibraryTab studentId={student.id} />,
                },
              ]
            : []),
          {
            id: 'activity',
            label: 'Activity',
            content: <StudentActivityTab studentId={student.id} />,
          },
        ]}
      />

      {mayEdit && (
        <ChangeStatusDialog
          open={changing}
          studentId={student.id}
          studentName={name}
          currentStatus={student.status}
          onClose={() => setChanging(false)}
          onDone={statusChanged}
        />
      )}
    </div>
  );
}
