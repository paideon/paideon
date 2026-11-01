import { capabilitiesForRole } from '@paideon/contracts';

import { navFor } from './nav';

const as = (role: Parameters<typeof capabilitiesForRole>[0]) => ({
  capabilities: capabilitiesForRole(role),
});

const hrefs = (user: ReturnType<typeof as>) =>
  navFor(user as never).groups.flatMap((g) => g.items.map((i) => i.href));

describe('navFor', () => {
  const ACCOUNT = [
    '/account/library',
    '/account/badge',
    '/account',
    '/account/security',
  ];

  it('shows a student Home, book search, their account and help only', () => {
    const nav = navFor(as('STUDENT') as never);
    expect(nav.groups.map((g) => g.id)).toEqual([
      'home',
      'library',
      'account',
      'help',
    ]);
    expect(hrefs(as('STUDENT'))).toEqual([
      '/home',
      '/books',
      ...ACCOUNT,
      '/privacy',
    ]);
    expect(nav.tiles.map((t) => t.href)).toEqual([
      '/books',
      '/account/library',
      '/account/badge',
    ]);
  });

  it('shows a librarian the whole library desk', () => {
    expect(hrefs(as('LIBRARIAN'))).toEqual([
      '/home',
      '/books',
      '/librarian',
      '/librarian/checkout',
      '/librarian/return',
      '/librarian/books',
      '/librarian/members',
      '/librarian/overdue',
      ...ACCOUNT,
      '/privacy',
    ]);
    expect(navFor(as('LIBRARIAN') as never).tiles.map((t) => t.href)).toEqual([
      '/books',
      '/librarian',
      '/account/library',
      '/account/badge',
    ]);
  });

  it('shows an admin everything a librarian sees', () => {
    expect(hrefs(as('ADMIN'))).toEqual(hrefs(as('LIBRARIAN')));
  });

  it('follows capabilities, not roles', () => {
    const onlyFines = {
      capabilities: [{ capability: 'library.members.read', scope: 'SCHOOL' }],
    };
    expect(hrefs(onlyFines as never)).toContain('/librarian/members');
    expect(hrefs(onlyFines as never)).not.toContain('/librarian/checkout');
  });

  it('drops a group that has nothing to show', () => {
    const groups = navFor({ capabilities: [] } as never).groups.map(
      (g) => g.id,
    );
    expect(groups).toEqual(['home', 'library', 'account', 'help']);
    expect(groups).not.toContain('people');
  });
});
