import { isPublicPath, safeNext } from './routes';

describe('safeNext', () => {
  it('falls back to /home when there is nothing to go back to', () => {
    expect(safeNext(null)).toBe('/home');
    expect(safeNext(undefined)).toBe('/home');
    expect(safeNext('')).toBe('/home');
  });

  it('keeps a path on this site, with its query', () => {
    expect(safeNext('/books')).toBe('/books');
    expect(safeNext('/books?q=maths')).toBe('/books?q=maths');
    expect(safeNext('/librarian/checkout')).toBe('/librarian/checkout');
  });

  it('refuses addresses on other sites', () => {
    expect(safeNext('https://evil.test')).toBe('/home');
    expect(safeNext('//evil.test')).toBe('/home');
    expect(safeNext('/\\evil.test')).toBe('/home');
    expect(safeNext('javascript:alert(1)')).toBe('/home');
    expect(safeNext('books')).toBe('/home');
  });

  it('refuses control characters', () => {
    expect(safeNext('/books\r\nSet-Cookie: x=1')).toBe('/home');
  });

  it('never returns to a sign-in page', () => {
    expect(safeNext('/login')).toBe('/home');
    expect(safeNext('/login?next=/books')).toBe('/home');
    expect(safeNext('/activate/abc')).toBe('/home');
    expect(safeNext('/')).toBe('/home');
  });
});

describe('isPublicPath', () => {
  it('lists the pages that need no session', () => {
    for (const path of [
      '/',
      '/login',
      '/activate/abc123',
      '/forgot-password',
      '/reset-password/abc123',
      '/privacy',
      '/maintenance',
    ]) {
      expect(isPublicPath(path)).toBe(true);
    }
  });

  it('treats everything else as signed-in only', () => {
    for (const path of ['/home', '/books', '/librarian', '/403', '/loginx']) {
      expect(isPublicPath(path)).toBe(false);
    }
  });
});
