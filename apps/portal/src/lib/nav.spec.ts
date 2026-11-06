import { grantsForPreset, type PresetName } from '@paideon/contracts';

import { navFor } from './nav';

// A signed-in person with no grants, or with the grants of one preset.
const as = (preset: PresetName | 'NONE') => ({
  capabilities: preset === 'NONE' ? [] : grantsForPreset(preset),
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
    const nav = navFor(as('NONE') as never);
    expect(nav.groups.map((g) => g.id)).toEqual([
      'home',
      'library',
      'account',
      'help',
    ]);
    expect(hrefs(as('NONE'))).toEqual([
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

  it('shows an admin the library desk and the People pages', () => {
    const admin = hrefs(as('ADMIN'));
    for (const href of hrefs(as('LIBRARIAN'))) expect(admin).toContain(href);
    expect(admin).toContain('/people');
    expect(admin).toContain('/people/students');
  });

  it('shows People to a class teacher but not the library desk', () => {
    const teacher = {
      capabilities: grantsForPreset('CLASS_TEACHER', 'CLASS:abc'),
    };
    expect(hrefs(teacher as never)).toContain('/people/students');
    expect(hrefs(teacher as never)).not.toContain('/librarian');
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
