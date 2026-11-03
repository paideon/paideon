import { breadcrumbsFor } from './breadcrumbs';

describe('breadcrumbsFor', () => {
  it('is just Home on /home, without a link', () => {
    expect(breadcrumbsFor('/home')).toEqual([{ label: 'Home' }]);
  });

  it('builds Home > section > page and leaves the last unlinked', () => {
    expect(breadcrumbsFor('/library/checkout')).toEqual([
      { label: 'Home', href: '/home' },
      { label: 'Library', href: '/library' },
      { label: 'Checkout' },
    ]);
  });

  it('labels /library/books (manage) differently from /library/catalog (search)', () => {
    expect(breadcrumbsFor('/library/books').at(-1)?.label).toBe('Books');
    expect(breadcrumbsFor('/library/catalog').at(-1)?.label).toBe(
      'Search books',
    );
  });

  it('skips segments it has no name for (ids, tokens)', () => {
    expect(
      breadcrumbsFor('/library/catalog/9f3a2c').map((c) => c.label),
    ).toEqual(['Home', 'Library', 'Search books']);
  });

  it('names the account pages', () => {
    expect(breadcrumbsFor('/account/badge').map((c) => c.label)).toEqual([
      'Home',
      'My account',
      'ID badge',
    ]);
    expect(breadcrumbsFor('/account/security').at(-1)).toEqual({
      label: 'Security',
    });
  });
});
