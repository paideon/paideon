import { grantsForSystemRoles } from '@paideon/contracts';

import { navFor, staffLibraryTiles } from './nav';

// People are described by the roles they hold; the menu follows the
// capabilities those roles add up to.
const holding = (...roleKeys: string[]) => ({
  capabilities: grantsForSystemRoles(roleKeys),
});

const hrefs = (user: ReturnType<typeof holding>) =>
  navFor(user as never).groups.flatMap((g) => g.items.map((i) => i.href));

describe('navFor', () => {
  const ACCOUNT = ['/account/badge', '/account', '/account/security'];

  it('shows a reader Home, the library, their account and help only', () => {
    const reader = holding('reader');
    const nav = navFor(reader as never);
    expect(nav.groups.map((g) => g.id)).toEqual([
      'home',
      'library',
      'account',
      'help',
    ]);
    expect(hrefs(reader)).toEqual([
      '/home',
      '/library',
      '/library/catalog',
      ...ACCOUNT,
      '/privacy',
    ]);
    expect(nav.tiles.map((t) => t.href)).toEqual([
      '/library',
      '/account/badge',
    ]);
  });

  it('shows a librarian, who is also a reader, the whole library desk', () => {
    const librarian = holding('reader', 'librarian');
    expect(hrefs(librarian)).toEqual([
      '/home',
      '/library',
      '/library/catalog',
      '/library/checkout',
      '/library/return',
      '/library/books',
      '/library/members',
      '/library/overdue',
      ...ACCOUNT,
      '/privacy',
    ]);
    expect(navFor(librarian as never).tiles.map((t) => t.href)).toEqual([
      '/library',
      '/account/badge',
    ]);
  });

  it('shows a super admin everything a librarian sees, for now', () => {
    expect(hrefs(holding('super-admin'))).toEqual(
      hrefs(holding('reader', 'librarian')),
    );
  });

  it('follows capabilities, not roles', () => {
    const onlyMembers = {
      capabilities: [{ capability: 'library.members.read', scope: 'SCHOOL' }],
    };
    expect(hrefs(onlyMembers as never)).toContain('/library');
    expect(hrefs(onlyMembers as never)).toContain('/library/members');
    expect(hrefs(onlyMembers as never)).not.toContain('/library/checkout');
  });

  it('hides the library from someone who holds no library capability', () => {
    const groups = navFor({ capabilities: [] } as never).groups.map(
      (g) => g.id,
    );
    expect(groups).toEqual(['home', 'account', 'help']);
  });
});

describe('staffLibraryTiles', () => {
  it('is empty for a reader', () => {
    expect(staffLibraryTiles(holding('reader') as never)).toEqual([]);
  });

  it("lists the librarian's tools for someone holding the desk capabilities", () => {
    const tiles = staffLibraryTiles(holding('reader', 'librarian') as never);
    expect(tiles.map((t) => t.href)).toEqual([
      '/library/checkout',
      '/library/return',
      '/library/books',
      '/library/members',
      '/library/overdue',
    ]);
  });
});
