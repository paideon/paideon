'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  MAX_BADGES_PER_PRINT,
  STUDENT_MISSING_LABELS,
  StudentListSchema,
  type AssignClassResultData,
  type StudentListQueryData,
  type StudentSummaryData,
} from '@paideon/contracts';
import {
  Alert,
  Button,
  ButtonLink,
  DataTable,
  ErrorState,
  Icon,
  Input,
  LoadingSkeleton,
  PageHeader,
  Pagination,
} from '@paideon/ui';

import { PersonCell } from '@/components/common/PersonCell';
import { useApiResource } from '@/hooks/useApiResource';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { apiDownload } from '@/lib/api';
import { can } from '@/lib/capabilities';
import { ROUTES, studentRoute } from '@/lib/routes';
import { parseStudentSearch, studentQueryString } from '@/lib/student-query';

import { AssignClassDialog } from './AssignClassDialog';
import { StudentFilters } from './StudentFilters';
import { StudentStatusBadge } from './StudentStatusBadge';

// Selected students travel to the badge page and the export in the address,
// so the selection is capped to keep that address short.
const MAX_SELECTED = MAX_BADGES_PER_PRINT;

// Column key of each server-side sort.
const SORT_KEY = {
  name: 'lastName',
  admissionNumber: 'admissionNumber',
  class: 'grade',
} as const;

const titleCase = (text: string) =>
  text.charAt(0) + text.slice(1).toLowerCase();
const classText = (row: StudentSummaryData) =>
  row.section ? `${row.grade}-${row.section}` : `Grade ${row.grade}`;

export function StudentsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const user = useCurrentUser();
  const mayEdit = can(user, 'people.write');

  const query = useMemo(
    () => parseStudentSearch(new URLSearchParams(params.toString())),
    [params],
  );
  const queryText = studentQueryString(query);
  const { data, error, loading, reload } = useApiResource(
    `/people/students${queryText ? `?${queryText}` : ''}`,
    StudentListSchema,
  );

  const go = (next: StudentListQueryData) => {
    const text = studentQueryString(next);
    router.replace(text ? `${pathname}?${text}` : pathname);
  };
  // A change to the filters starts again from page 1.
  const change = (changes: Partial<StudentListQueryData>) =>
    go({ ...query, ...changes, page: changes.page ?? 1 });

  // Search as you type, after a short pause.
  const [search, setSearch] = useState(query.q ?? '');
  const pushed = useRef(query.q ?? '');
  useEffect(() => {
    if ((query.q ?? '') !== pushed.current) {
      // The address changed from outside (back button, a link): follow it.
      pushed.current = query.q ?? '';
      setSearch(query.q ?? '');
    }
  }, [query.q]);
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (query.q ?? '')) return;
    const timer = setTimeout(() => {
      pushed.current = trimmed;
      change({ q: trimmed || undefined });
    }, 300);
    return () => clearTimeout(timer);
    // `change` and `query` are rebuilt every render; the timer only needs the text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [assigning, setAssigning] = useState(false);
  const [notice, setNotice] = useState<{
    variant: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);
  const [exporting, setExporting] = useState(false);

  const ids = [...selected].map(String);
  const tooMany = ids.length > MAX_SELECTED;

  async function exportCsv(onlySelected: boolean) {
    setExporting(true);
    setNotice(null);
    try {
      const text = onlySelected
        ? studentQueryString({ status: 'ALL' }, { ids: ids.join(',') })
        : studentQueryString({ ...query, page: 1 });
      await apiDownload(
        `/people/students/export.csv${text ? `?${text}` : ''}`,
        'students.csv',
      );
    } catch (cause) {
      setNotice({
        variant: 'error',
        text:
          cause instanceof Error
            ? cause.message
            : 'The export failed. Try again.',
      });
    } finally {
      setExporting(false);
    }
  }

  function afterAssign(result: AssignClassResultData) {
    setSelected(new Set());
    reload();
    const skipped = result.skipped.length;
    setNotice({
      variant: skipped > 0 ? 'warning' : 'success',
      text:
        `${result.assigned} ${result.assigned === 1 ? 'student' : 'students'} assigned.` +
        (skipped > 0
          ? ` ${skipped} skipped: ${[...new Set(result.skipped.map((s) => s.reason))].join(' ')}`
          : ''),
    });
  }

  const hasFilters =
    query.q !== undefined ||
    studentQueryString({
      ...query,
      q: undefined,
      page: 1,
      sort: 'name',
      dir: 'asc',
    }) !== '';
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return (
    <div className="flex flex-col gap-space-4">
      <PageHeader
        title="Students"
        description={
          data
            ? `${data.total} ${data.total === 1 ? 'student' : 'students'} match${data.total === 1 ? 'es' : ''}.`
            : 'Find a student and act on groups of students.'
        }
        actions={
          <>
            <Button
              variant="secondary"
              loading={exporting}
              onClick={() => void exportCsv(false)}
            >
              Export CSV
            </Button>
            {mayEdit && (
              <ButtonLink href={ROUTES.studentNew}>Add student</ButtonLink>
            )}
          </>
        }
      />

      <Input
        label="Search"
        type="search"
        value={search}
        placeholder="Name, admission number or Paideon ID"
        onChange={(event) => setSearch(event.target.value)}
        autoComplete="off"
      />

      <StudentFilters
        query={query}
        onChange={change}
        onClear={() =>
          go({
            ...query,
            grade: undefined,
            classId: undefined,
            medium: undefined,
            gender: undefined,
            status: 'ACTIVE',
            missingPhoto: undefined,
            missingGuardianPhone: undefined,
            page: 1,
          })
        }
      />

      {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}

      {ids.length > 0 && (
        <div
          role="region"
          aria-label="Selected students"
          className="sticky top-0 z-raised flex flex-wrap items-center gap-space-3 rounded-sm border border-gold-base bg-gold-pale px-space-4 py-space-3"
        >
          <span className="font-body text-body-sm text-text-primary">
            {ids.length} selected
            {tooMany && ` (choose at most ${MAX_SELECTED} at a time)`}
          </span>
          <ButtonLink
            size="sm"
            variant="secondary"
            href={`${ROUTES.studentBadges}?ids=${encodeURIComponent(ids.join(','))}`}
            disabled={tooMany}
          >
            Print badges
          </ButtonLink>
          <Button
            size="sm"
            variant="secondary"
            disabled={tooMany || exporting}
            onClick={() => void exportCsv(true)}
          >
            Export CSV
          </Button>
          {mayEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAssigning(true)}
            >
              Assign class
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </Button>
        </div>
      )}

      {loading && !data ? (
        <LoadingSkeleton variant="table-row" count={8} />
      ) : !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className={loading ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable<StudentSummaryData>
            data={data.items}
            getRowKey={(row) => row.id}
            onRowClick={(row) => router.push(studentRoute(row.id))}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
            getRowLabel={(row) => `Select ${row.firstName} ${row.lastName}`}
            sort={{ key: SORT_KEY[query.sort], direction: query.dir }}
            onSort={(key, direction) => {
              const sort = (
                Object.keys(SORT_KEY) as (keyof typeof SORT_KEY)[]
              ).find((name) => SORT_KEY[name] === key);
              if (!sort || direction === null)
                change({ sort: 'name', dir: 'asc' });
              else change({ sort, dir: direction });
            }}
            emptyMessage={
              hasFilters
                ? 'No students match these filters.'
                : 'There are no students yet.'
            }
            columns={[
              {
                key: 'lastName',
                header: 'Student',
                sortable: true,
                render: (_value, row) => (
                  <PersonCell
                    name={`${row.firstName} ${row.lastName}`}
                    photoUrl={row.photoUrl}
                    subtitle={row.paideonId}
                  />
                ),
              },
              {
                key: 'admissionNumber',
                header: 'Admission no.',
                sortable: true,
              },
              {
                key: 'grade',
                header: 'Class',
                sortable: true,
                render: (_value, row) => classText(row),
              },
              {
                key: 'medium',
                header: 'Medium',
                render: (value) => titleCase(String(value)),
              },
              {
                key: 'gender',
                header: 'Gender',
                render: (value) => titleCase(String(value)),
              },
              {
                key: 'status',
                header: 'Status',
                render: (_value, row) => (
                  <StudentStatusBadge status={row.status} />
                ),
              },
              {
                key: 'guardianPhone',
                header: 'Guardian phone',
                render: (value, row) =>
                  value
                    ? String(value)
                    : row.missing.includes('GUARDIAN_PHONE')
                      ? '—'
                      : 'Hidden',
              },
              {
                key: 'missing',
                header: 'Check',
                render: (_value, row) =>
                  row.missing.length > 0 ? (
                    <span
                      className="inline-flex text-semantic-warning-base"
                      title={row.missing
                        .map((m) => STUDENT_MISSING_LABELS[m])
                        .join(', ')}
                    >
                      <Icon
                        name="alert-triangle"
                        size="xs"
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        {row.missing
                          .map((m) => STUDENT_MISSING_LABELS[m])
                          .join(', ')}
                      </span>
                    </span>
                  ) : null,
              },
            ]}
          />
          {totalPages > 1 && (
            <Pagination
              className="mt-space-4"
              totalPages={totalPages}
              currentPage={data.page}
              onPageChange={(page) => change({ page })}
            />
          )}
        </div>
      )}

      <AssignClassDialog
        open={assigning}
        studentIds={ids}
        onClose={() => setAssigning(false)}
        onDone={afterAssign}
      />
    </div>
  );
}
