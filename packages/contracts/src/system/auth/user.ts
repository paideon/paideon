// packages/contracts/src/system/auth/user.ts
//
// An authenticated user account.

import { z } from 'zod';

import { RoleEnum } from '../rbac/role.ts';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: RoleEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserData = z.infer<typeof UserSchema>;
