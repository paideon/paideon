import type { CapabilityEnumData, CurrentUserData } from '@paideon/contracts';
import type { IconName, SidebarGroup } from '@paideon/ui';

import { canAny } from './capabilities';
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
  /** The person needs any ONE of these. Leave out for everyone signed in. */
  needs?: CapabilityEnumData | readonly CapabilityEnumData[];
  /** Show as a card on /home too. */
  tile?: string;
  /** A librarian's tool: shown as a card on the /library page, not on /home. */
  staffBlurb?: string;
};

// Anything that makes /library worth opening. A person with none of these has
// no library at all, so the sidebar does not show it.
export const LIBRARY_CAPABILITIES: readonly CapabilityEnumData[] = [
  'library.own.read',
  'library.catalog.read',
  'library.desk',
  'library.manage',
  'library.members.read',
  'library.fines',
  'library.reports',
];

const asList = (needs: NavEntry['needs']): readonly CapabilityEnumData[] =>
  needs === undefined ? [] : typeof needs === 'string' ? [needs] : needs;

export const NAV_GROUPS: { id: string; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'account', label: 'My account' },
  { id: 'help', label: 'Help' },
];

const NAV_ENTRIES: NavEntry[] = [
  { id: 'home', group: 'home', label: 'Home', href: ROUTES.home, icon: 'home' },
  {
    id: 'library',
    group: 'library',
    label: 'Library',
    href: ROUTES.library,
    icon: 'book-open',
    needs: LIBRARY_CAPABILITIES,
    tile: 'Your borrowed books, due dates and fines, and the catalog.',
  },
  {
    id: 'catalog',
    group: 'library',
    label: 'Search books',
    href: ROUTES.libraryCatalog,
    icon: 'search',
    needs: 'library.catalog.read',
  },
  {
    id: 'checkout',
    group: 'library',
    label: 'Checkout',
    href: ROUTES.libraryCheckout,
    icon: 'arrow-right',
    needs: 'library.desk',
    staffBlurb: 'Lend books: scan a member, then the books.',
  },
  {
    id: 'return',
    group: 'library',
    label: 'Return',
    href: ROUTES.libraryReturn,
    icon: 'arrow-left',
    needs: 'library.desk',
    staffBlurb: 'Take books back and see any fine.',
  },
  {
    id: 'manage-books',
    group: 'library',
    label: 'Books',
    href: ROUTES.libraryBooks,
    icon: 'archive',
    needs: 'library.manage',
    staffBlurb: 'Add and edit books and copies.',
  },
  {
    id: 'members',
    group: 'library',
    label: 'Members and fines',
    href: ROUTES.libraryMembers,
    icon: 'users',
    needs: 'library.members.read',
    staffBlurb: "Look up a member's loans and fines.",
  },
  {
    id: 'overdue',
    group: 'library',
    label: 'Overdue',
    href: ROUTES.libraryOverdue,
    icon: 'clock',
    needs: 'library.reports',
    staffBlurb: 'Books that are late, and who has them.',
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
    (entry) => entry.needs === undefined || canAny(user, asList(entry.needs)),
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

/** The librarian's tools the person may use, for the cards on /library. */
export function staffLibraryTiles(
  user: Pick<CurrentUserData, 'capabilities'>,
): HomeTile[] {
  return NAV_ENTRIES.filter(
    (entry) =>
      entry.staffBlurb !== undefined && canAny(user, asList(entry.needs)),
  ).map((entry) => ({
    label: entry.label,
    description: entry.staffBlurb as string,
    href: entry.href,
  }));
}
