import { breadcrumbsFor } from './breadcrumbs';

describe('breadcrumbsFor', () => {
  it('is just Home on /home, without a link', () => {
    expect(breadcrumbsFor('/home')).toEqual([{ label: 'Home' }]);
  });

  it('builds Home > section > page and leaves the last unlinked', () => {
    expect(breadcrumbsFor('/librarian/checkout')).toEqual([
      { label: 'Home', href: '/home' },
      { label: 'Library desk', href: '/librarian' },
      { label: 'Checkout' },
    ]);
  });

  it('labels /librarian/books differently from /books', () => {
    expect(breadcrumbsFor('/librarian/books').at(-1)?.label).toBe('Books');
    expect(breadcrumbsFor('/books').at(-1)?.label).toBe('Search books');
  });

  it('skips segments it has no name for (ids, tokens)', () => {
    expect(breadcrumbsFor('/books/9f3a2c').map((c) => c.label)).toEqual([
      'Home',
      'Search books',
    ]);
  });
});
