// packages/contracts/src/system/rbac/role.ts
//
// The closed set of built-in roles and the role assignment shape.

import { z } from 'zod';

export const ROLE_VALUES = ['admin', 'editor', 'viewer'] as const;

export const RoleEnum = z.enum(ROLE_VALUES);

export type RoleEnumData = z.infer<typeof RoleEnum>;

export const RoleAssignmentSchema = z.object({
  userId: z.string(),
  role: RoleEnum,
  assignedAt: z.string(),
  assignedBy: z.string(),
});

export type RoleAssignmentData = z.infer<typeof RoleAssignmentSchema>;
