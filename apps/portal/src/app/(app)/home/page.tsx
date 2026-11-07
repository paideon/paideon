'use client';

import { PageHeader } from '@paideon/ui';

import { DueSoonList } from '@/components/home/DueSoonList';
import { HomeBadge } from '@/components/home/HomeBadge';
import { HomeTiles } from '@/components/home/HomeTiles';
import { LibraryDeskStats } from '@/components/home/LibraryDeskStats';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { can } from '@/lib/capabilities';
import { greetingFor } from '@/lib/format';
import { navFor } from '@/lib/nav';

export default function HomePage() {
  const user = useCurrentUser();
  const { tiles } = navFor(user);
  const name = user.displayName || user.firstName;

  // Extras follow what the person can do, not who they are.
  const atTheDesk = can(user, 'library.desk');
  // Parents have no library membership. Everyone else may have books out.
  const mayBorrow = user.kind !== 'PARENT';

  return (
    <div className="grid gap-space-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex min-w-0 flex-col gap-space-8">
        <PageHeader
          title={`${greetingFor(new Date().getHours())}, ${name}`}
          description={`Signed in as ${user.firstName} ${user.lastName} (${user.paideonId})`}
        />
        <HomeTiles tiles={tiles} />
        {atTheDesk && <LibraryDeskStats />}
        {mayBorrow && <DueSoonList />}
      </div>
      <aside aria-label="Your ID badge">
        <HomeBadge />
      </aside>
    </div>
  );
}
