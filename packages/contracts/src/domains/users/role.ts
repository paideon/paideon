// Mirrors the Prisma `Role` enum in packages/database exactly. Contracts
// cannot import the Prisma client (it belongs only to the API and database
// packages), so keep this list in sync with schema.prisma by hand.

import { z } from 'zod';

export const ROLE_VALUES = [
  'STUDENT',
  'TEACHER',
  'PARENT',
  'STAFF',
  'LIBRARIAN',
  'ADMIN',
] as const;

export const RoleEnum = z.enum(ROLE_VALUES);

export type RoleEnumData = z.infer<typeof RoleEnum>;
