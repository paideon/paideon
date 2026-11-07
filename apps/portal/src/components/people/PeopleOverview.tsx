'use client';

import Link from 'next/link';
import { SchoolSnapshotSchema, snapshotToStats } from '@paideon/contracts';
import {
  ErrorState,
  Grid,
  LoadingSkeleton,
  PageHeader,
  StatCard,
} from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { can } from '@/lib/capabilities';
import { ROUTES } from '@/lib/routes';

type Action = {
  label: string;
  description: string;
  href?: string;
  /** Shown but not yet usable. */
  soon?: boolean;
};

const cardClass =
  'flex h-full flex-col gap-space-1 rounded-md border border-border-light bg-surface-elevated p-space-4';

// The People landing page: how complete the records are, and the usual jobs.
export function PeopleOverview() {
  const user = useCurrentUser();
  const { data, error, loading, reload } = useApiResource(
    '/stats/snapshot',
    SchoolSnapshotSchema,
  );

  const actions: Action[] = [
    ...(can(user, 'people.write')
      ? [
          {
            label: 'Add student',
            description: 'Create one student record.',
            href: ROUTES.studentNew,
          },
        ]
      : []),
    {
      label: 'Review data issues',
      description: 'Students with no photo, so their badge cannot be printed.',
      href: `${ROUTES.students}?missingPhoto=true`,
    },
    {
      label: 'Students with no guardian phone',
      description: 'Records the office cannot call about.',
      href: `${ROUTES.students}?missingGuardianPhone=true`,
    },
    ...(can(user, 'people.write')
      ? [
          {
            label: 'Import students',
            description: 'Add many students from a spreadsheet. Coming soon.',
            soon: true,
          },
        ]
      : []),
    ...(can(user, 'accounts.manage')
      ? [
          {
            label: 'Invite accounts',
            description: 'Send activation links. Coming soon.',
            soon: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-space-8">
      <PageHeader
        title="People"
        description={
          data?.academicYear
            ? `Students, teachers and staff. Academic year ${data.academicYear}.`
            : 'Students, teachers and staff.'
        }
      />

      {loading && !data ? (
        <LoadingSkeleton variant="section" />
      ) : !data ? (
        <ErrorState variant="section" message={error} onRetry={reload} />
      ) : (
        <Grid columns="repeat(auto-fit,minmax(11rem,1fr))" gap={4}>
          {snapshotToStats(data).map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </Grid>
      )}

      <section aria-label="Common jobs">
        <ul className="m-space-0 grid list-none gap-space-3 p-space-0 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <li key={action.label}>
              {action.href && !action.soon ? (
                <Link
                  href={action.href}
                  className={`${cardClass} transition-colors duration-fast hover:border-gold-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base`}
                >
                  <span className="font-body text-body font-semibold text-text-primary">
                    {action.label}
                  </span>
                  <span className="font-body text-body-sm text-text-muted">
                    {action.description}
                  </span>
                </Link>
              ) : (
                <div aria-disabled="true" className={`${cardClass} opacity-60`}>
                  <span className="font-body text-body font-semibold text-text-primary">
                    {action.label}
                  </span>
                  <span className="font-body text-body-sm text-text-muted">
                    {action.description}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
