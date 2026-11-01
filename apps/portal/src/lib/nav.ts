import type { CapabilityEnumData, CurrentUserData } from '@paideon/contracts';
import type { IconName, SidebarGroup } from '@paideon/ui';

import { can } from './capabilities';
import { ROUTES } from './routes';

// The sidebar and the Home tiles come from this one table, so a person with
// several capabilities sees all their areas. Add a row when a page is built.
// Rows without `needs` are for everyone who is signed in.
//
// Groups follow 00-FOUNDATIONS.md section 3: Home, People, School, Data entry,
// Stats, Library, Settings, Help. Only groups that have a built page appear
// below; a group is shown only when it has at least one item the person may use.

type NavEntry = {
  id: string;
  group: string;
  label: string;
  href: string;
  icon: IconName;
  needs?: CapabilityEnumData;
  /** Show as a card on /home too. */
  tile?: string;
};

export const NAV_GROUPS: { id: string; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'account', label: 'My account' },
  { id: 'help', label: 'Help' },
];

const NAV_ENTRIES: NavEntry[] = [
  { id: 'home', group: 'home', label: 'Home', href: ROUTES.home, icon: 'home' },
  {
    id: 'books',
    group: 'library',
    label: 'Search books',
    href: ROUTES.books,
    icon: 'search',
    tile: 'Find a book and see if it is available.',
  },
  {
    id: 'desk',
    group: 'library',
    label: 'Library desk',
    href: ROUTES.libraryDesk,
    icon: 'book-open',
    needs: 'library.desk',
    tile: 'Checkout, return, members and overdue books.',
  },
  {
    id: 'checkout',
    group: 'library',
    label: 'Checkout',
    href: '/librarian/checkout',
    icon: 'arrow-right',
    needs: 'library.desk',
  },
  {
    id: 'return',
    group: 'library',
    label: 'Return',
    href: '/librarian/return',
    icon: 'arrow-left',
    needs: 'library.desk',
  },
  {
    id: 'manage-books',
    group: 'library',
    label: 'Books',
    href: '/librarian/books',
    icon: 'archive',
    needs: 'library.manage',
  },
  {
    id: 'members',
    group: 'library',
    label: 'Members and fines',
    href: '/librarian/members',
    icon: 'users',
    needs: 'library.members.read',
  },
  {
    id: 'overdue',
    group: 'library',
    label: 'Overdue',
    href: '/librarian/overdue',
    icon: 'clock',
    needs: 'library.reports',
  },
  {
    id: 'my-library',
    group: 'account',
    label: 'My library',
    href: ROUTES.accountLibrary,
    icon: 'book-open',
    tile: 'Books you have borrowed, fines and your history.',
  },
  {
    id: 'badge',
    group: 'account',
    label: 'ID badge',
    href: ROUTES.accountBadge,
    icon: 'award',
    tile: 'Show or print your school ID and library card.',
  },
  {
    id: 'profile',
    group: 'account',
    label: 'My profile',
    href: ROUTES.account,
    icon: 'user',
  },
  {
    id: 'security',
    group: 'account',
    label: 'Security',
    href: ROUTES.accountSecurity,
    icon: 'eye-off',
  },
  {
    id: 'privacy',
    group: 'help',
    label: 'Privacy notice',
    href: ROUTES.privacy,
    icon: 'file-text',
  },
];

export type HomeTile = { label: string; description: string; href: string };

export type Navigation = { groups: SidebarGroup[]; tiles: HomeTile[] };

export function navFor(
  user: Pick<CurrentUserData, 'capabilities'>,
): Navigation {
  const allowed = NAV_ENTRIES.filter(
    (entry) => entry.needs === undefined || can(user, entry.needs),
  );

  const groups: SidebarGroup[] = NAV_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    items: allowed
      .filter((entry) => entry.group === group.id)
      .map(({ id, label, href, icon }) => ({ id, label, href, icon })),
  })).filter((group) => group.items.length > 0);

  const tiles: HomeTile[] = allowed
    .filter((entry) => entry.tile !== undefined)
    .map((entry) => ({
      label: entry.label,
      description: entry.tile as string,
      href: entry.href,
    }));

  return { groups, tiles };
}
