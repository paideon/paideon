import type { CurrentUser } from './api';

/** One constant per route. Pages and redirects use these, never string literals. */
export const ROUTES = {
  landing: '/',
  login: '/login',
  loginActivate: '/login?mode=activate',
  forgotPassword: '/forgot-password',
  privacy: '/privacy',
  maintenance: '/maintenance',
  forbidden: '/403',
  home: '/home',
  books: '/books',
  account: '/account',
  accountBadge: '/account/badge',
  accountLibrary: '/account/library',
  accountSecurity: '/account/security',
  libraryDesk: '/librarian',
  people: '/people',
  students: '/people/students',
  studentNew: '/people/students/new',
  studentBadges: '/people/students/badges',
} as const;

export const studentRoute = (id: string) =>
  `${ROUTES.students}/${encodeURIComponent(id)}`;
export const studentEditRoute = (id: string) => `${studentRoute(id)}/edit`;
export const studentPhotoRoute = (id: string) => `${studentRoute(id)}/photo`;
export const studentBadgeRoute = (id: string) => `${studentRoute(id)}/badge`;

/** Link target for an activation or reset token from an email. */
export const activateRoute = (token: string) =>
  `/activate/${encodeURIComponent(token)}`;
export const resetPasswordRoute = (token: string) =>
  `/reset-password/${encodeURIComponent(token)}`;

/** Pages anyone can open without signing in. */
const PUBLIC_PREFIXES = [
  '/login',
  '/activate',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/maintenance',
];

export function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Where to go after signing in. `next` comes from the URL, so it is untrusted:
 * only a path on this site is accepted ("/books"), never "https://evil.test"
 * or "//evil.test". Anything else falls back to /home.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next) return ROUTES.home;
  if (!next.startsWith('/')) return ROUTES.home;
  if (next.startsWith('//') || next.startsWith('/\\')) return ROUTES.home;
  if (/[\u0000-\u001f]/.test(next)) return ROUTES.home;
  // Never bounce back into the sign-in pages.
  if (isPublicPath(next.split(/[?#]/)[0] ?? '')) return ROUTES.home;
  return next;
}

/** Everyone lands on /home unless they were sent to sign in from another page. */
export function postLoginPath(
  _user: CurrentUser,
  next?: string | null,
): string {
  return safeNext(next);
}
