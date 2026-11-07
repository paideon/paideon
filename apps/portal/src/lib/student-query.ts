// The students list keeps its filters in the page address, so a refresh, the
// back button and a shared link all show the same list. These functions turn
// the address into a query for the API and back.

import {
  StudentListQuerySchema,
  type StudentListQueryData,
} from '@paideon/contracts';

/** The keys the list reads from the address. Anything else is ignored. */
const KEYS = [
  'q',
  'grade',
  'classId',
  'medium',
  'gender',
  'status',
  'missingPhoto',
  'missingGuardianPhone',
  'sort',
  'dir',
  'page',
] as const;

type Key = (typeof KEYS)[number];

/** Reads and checks the address. A bad value falls back to the default. */
export function parseStudentSearch(
  params: URLSearchParams,
): StudentListQueryData {
  const raw: Record<string, string> = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value !== null && value !== '') raw[key] = value;
  }
  const parsed = StudentListQuerySchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  // Drop the keys that failed and keep the rest.
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string') delete raw[key];
  }
  const retry = StudentListQuerySchema.safeParse(raw);
  return retry.success ? retry.data : StudentListQuerySchema.parse({});
}

const DEFAULTS: Partial<Record<Key, string>> = {
  status: 'ACTIVE',
  sort: 'name',
  dir: 'asc',
  page: '1',
};

/**
 * The address for a query: only values that differ from the defaults, so the
 * plain list has a plain address. `extra` adds things the list does not own
 * (the API's page size, a list of selected ids).
 */
export function studentQueryString(
  query: Partial<StudentListQueryData>,
  extra: Record<string, string> = {},
): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = query[key];
    if (value === undefined || value === null || value === '') continue;
    if (value === false) continue;
    const text = String(value);
    if (DEFAULTS[key] === text) continue;
    params.set(key, text);
  }
  for (const [key, value] of Object.entries(extra)) params.set(key, value);
  return params.toString();
}

/** How many filters are set (search, sort and paging do not count). */
export function countStudentFilters(query: StudentListQueryData): number {
  return [
    query.grade !== undefined,
    query.classId !== undefined,
    query.medium !== undefined,
    query.gender !== undefined,
    query.status !== 'ACTIVE',
    query.missingPhoto === true,
    query.missingGuardianPhone === true,
  ].filter(Boolean).length;
}
