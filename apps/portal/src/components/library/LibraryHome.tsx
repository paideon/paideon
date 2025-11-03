'use client';

import { ButtonLink, Heading, PageHeader } from '@paideon/ui';

import { ForbiddenState } from '@/components/common/ForbiddenState';
import { HomeTiles } from '@/components/home/HomeTiles';
import { LibraryDeskStats } from '@/components/home/LibraryDeskStats';
import { MyLibrary } from '@/components/library/MyLibrary';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { can, canAny } from '@/lib/capabilities';
import { LIBRARY_CAPABILITIES, staffLibraryTiles } from '@/lib/nav';
import { ROUTES } from '@/lib/routes';

// The library page: one page for everyone, in layers. Each layer appears only
// when the person holds the capability for it, so a librarian is simply a
// reader who also holds the desk capabilities, and sees both layers here.
//
//   Reader layer  (library.catalog.read, library.own.read): search, and my
//                 borrowed books, fines and history.
//   Desk layer    (library.desk and friends): the day's numbers and the
//                 librarian's tools.
export function LibraryHome() {
  const user = useCurrentUser();

  if (!canAny(user, LIBRARY_CAPABILITIES)) return <ForbiddenState />;

  const mayRead = can(user, 'library.catalog.read');
  const hasOwnRecord = can(user, 'library.own.read');
  const staffTiles = staffLibraryTiles(user);

  return (
    <div className="flex flex-col gap-space-8">
      <PageHeader
        title="Library"
        description="Books you have borrowed, due dates and fines, and the catalog."
        actions={
          mayRead ? (
            <ButtonLink href={ROUTES.libraryCatalog} variant="secondary">
              Search books
            </ButtonLink>
          ) : undefined
        }
      />

      {staffTiles.length > 0 && (
        <section
          aria-labelledby="library-desk-heading"
          className="flex flex-col gap-space-4"
        >
          <Heading as="h2" level="h3" id="library-desk-heading">
            Library desk
          </Heading>
          {can(user, 'library.desk') || can(user, 'library.reports') ? (
            <LibraryDeskStats />
          ) : null}
          <HomeTiles tiles={staffTiles} label="Library desk tools" />
        </section>
      )}

      {hasOwnRecord && <MyShelf />}
    </div>
  );
}

// Only rendered for people who hold library.own.read, so nobody asks the
// server for a record they would be refused.
function MyShelf() {
  return (
    <section
      aria-labelledby="my-shelf-heading"
      className="flex flex-col gap-space-4"
    >
      <Heading as="h2" level="h3" id="my-shelf-heading">
        My borrowing
      </Heading>
      <MyLibrary />
    </section>
  );
}
