import { ROUTES } from './routes';

export type Crumb = { label: string; href?: string };

// Readable names for path segments. A segment that is not listed (an id, a
// token) is skipped rather than shown raw.
const LABELS: Record<string, string> = {
  home: 'Home',
  books: 'Search books',
  librarian: 'Library desk',
  checkout: 'Checkout',
  return: 'Return',
  members: 'Members and fines',
  overdue: 'Overdue',
  account: 'My account',
  badge: 'ID badge',
  security: 'Security',
  '403': 'No access',
};

// "/librarian/books" is "Books" in the sidebar, but "books" alone is the
// student search, so the label depends on the whole path.
const PATH_LABELS: Record<string, string> = {
  '/librarian/books': 'Books',
  '/account/library': 'My library',
};

/** Home > section > page, built from the URL. The last crumb has no link. */
export function breadcrumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', href: ROUTES.home }];

  let path = '';
  for (const segment of segments) {
    path += `/${segment}`;
    if (path === ROUTES.home) continue;
    const label = PATH_LABELS[path] ?? LABELS[segment];
    if (label) crumbs.push({ label, href: path });
  }

  const last = crumbs[crumbs.length - 1];
  if (last) delete last.href;
  return crumbs;
}
