// Mirrors the Prisma `UserStatus` enum in packages/database exactly.

import { z } from 'zod';

export const ACCOUNT_STATUS_VALUES = [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'GRADUATED',
  'INACTIVE',
] as const;

export const AccountStatusEnum = z.enum(ACCOUNT_STATUS_VALUES);

export type AccountStatusEnumData = z.infer<typeof AccountStatusEnum>;
