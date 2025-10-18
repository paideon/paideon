const apiBase = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
).replace(/\/+$/, '');

let accessToken: string | null = null;
let refreshRequest: Promise<boolean> | null = null;

export type CurrentUser = {
  id: string;
  schoolId: string;
  paideonId: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'STAFF' | 'LIBRARIAN' | 'ADMIN';
  status: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  cardNumber: string;
};

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

function tokenFrom(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const value = body as {
    accessToken?: unknown;
    data?: { accessToken?: unknown };
  };
  if (typeof value.accessToken === 'string') return value.accessToken;
  if (typeof value.data?.accessToken === 'string') {
    return value.data.accessToken;
  }
  return null;
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    const response = await fetch(`${apiBase}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      accessToken = null;
      return false;
    }
    const token = tokenFrom(await response.json());
    accessToken = token;
    return token !== null;
  })().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

function canRefresh(path: string) {
  return !['/auth/login', '/auth/refresh', '/auth/logout'].includes(path);
}

async function send(path: string, init: RequestInit) {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(`${apiBase}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function readError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as {
    message?: string | string[];
    code?: string;
  } | null;
  const message = Array.isArray(body?.message)
    ? body.message.join(', ')
    : (body?.message ?? `Request failed (${response.status})`);
  return new ApiError(message, response.status, body?.code);
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response = await send(path, init);

  if (response.status === 401 && canRefresh(path)) {
    if (await refreshAccessToken()) {
      response = await send(path, init);
    } else if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      window.location.assign('/login');
    }
  }

  if (!response.ok) {
    throw await readError(response);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function logout() {
  try {
    const response = await fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok && response.status !== 401) {
      throw new Error(`Logout failed (${response.status}).`);
    }
  } finally {
    clearAccessToken();
  }
}
