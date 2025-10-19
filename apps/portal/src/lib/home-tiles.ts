import type { CurrentUser } from './api';

export type HomeTile = { label: string; description: string; href: string };

/**
 * What /home shows. Based on role for now. When capabilities exist, only the
 * input of this function changes, not the page.
 */
export function tilesFor(user: CurrentUser): HomeTile[] {
  const tiles: HomeTile[] = [
    {
      label: 'Search books',
      description: 'Find a book and see if it is available.',
      href: '/books',
    },
  ];

  if (user.role === 'LIBRARIAN' || user.role === 'ADMIN') {
    tiles.push({
      label: 'Library desk',
      description: 'Checkout, return, members and overdue books.',
      href: '/librarian',
    });
  }

  return tiles;
}
