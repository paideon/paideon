'use client';

import { LibraryDeskStatsSchema } from '@paideon/contracts';
import { ErrorState, Grid, GridItem, Heading, StatCard } from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';

// Today at the library desk. Shown to people who hold library.desk.
export function LibraryDeskStats() {
  const { data, error, loading, reload } = useApiResource(
    '/library/reports/stats',
    LibraryDeskStatsSchema,
  );

  return (
    <section aria-labelledby="desk-today" className="flex flex-col gap-space-3">
      <Heading as="h2" level="h3" id="desk-today">
        Today at the desk
      </Heading>
      {error && !data && <ErrorState message={error} onRetry={reload} />}
      {loading && !data && !error && (
        <p className="text-text-muted">Loading…</p>
      )}
      {data && (
        <Grid columns="repeat(auto-fit,minmax(10rem,1fr))" gap={4}>
          <GridItem>
            <StatCard
              id="checkouts"
              target={data.loansToday}
              label="Checkouts today"
            />
          </GridItem>
          <GridItem>
            <StatCard
              id="returns"
              target={data.returnsToday}
              label="Returns today"
            />
          </GridItem>
          <GridItem>
            <StatCard
              id="overdue"
              target={data.overdueCount}
              label="Overdue now"
            />
          </GridItem>
        </Grid>
      )}
    </section>
  );
}
