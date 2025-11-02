// Access management: roles, who holds them, and extra grants. Used by the
// /api/access endpoints and the /settings/access screens. Everything here
// needs the access.manage capability.

import { z } from 'zod';
import {
  CapabilityEnum,
  CapabilityScopeSchema,
  CapabilityGrantSchema,
} from './capability.ts';

const ROLE_KEY = z
  .string()
  .regex(
    /^[a-z][a-z0-9-]{1,39}$/,
    'Use lowercase letters, digits and hyphens.',
  );

export const AccessRoleSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  /** Created by the system; cannot be deleted. */
  isSystem: z.boolean(),
  /** Cannot be edited at all (the super admin). */
  locked: z.boolean(),
  capabilities: z.array(CapabilityEnum),
  memberCount: z.number().int().nonnegative(),
});

export type AccessRoleData = z.infer<typeof AccessRoleSchema>;

export const CreateRoleSchema = z.object({
  key: ROLE_KEY,
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  capabilities: z.array(CapabilityEnum).max(64),
});

export type CreateRoleData = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().max(300).nullable(),
    capabilities: z.array(CapabilityEnum).max(64),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Nothing to change.');

export type UpdateRoleData = z.infer<typeof UpdateRoleSchema>;

export const AssignRoleSchema = z.object({
  roleId: z.string().min(1),
  scope: CapabilityScopeSchema.default('SCHOOL'),
});

export type AssignRoleData = z.infer<typeof AssignRoleSchema>;

export const CreateGrantSchema = z.object({
  capability: CapabilityEnum,
  scope: CapabilityScopeSchema.default('SCHOOL'),
  /** Why this person needs it. Shown in the audit log. */
  reason: z.string().trim().min(3).max(300),
  /** ISO date-time. Leave out for a grant that does not expire. */
  expiresAt: z.string().datetime().optional(),
});

export type CreateGrantData = z.infer<typeof CreateGrantSchema>;

export const MemberAccessSchema = z.object({
  userId: z.string(),
  roles: z.array(
    z.object({
      assignmentId: z.string(),
      roleId: z.string(),
      key: z.string(),
      name: z.string(),
      scope: z.string(),
      /** Held because of the kind of person they are, not assigned. */
      automatic: z.boolean(),
    }),
  ),
  grants: z.array(
    z.object({
      id: z.string(),
      capability: CapabilityEnum,
      scope: z.string(),
      reason: z.string(),
      expiresAt: z.string().nullable(),
      grantedBy: z.string(),
    }),
  ),
  /** The result: what this person may actually do. */
  effective: z.array(CapabilityGrantSchema),
});

export type MemberAccessData = z.infer<typeof MemberAccessSchema>;

export const CapabilityInfoSchema = z.object({
  capability: CapabilityEnum,
  label: z.string(),
  description: z.string(),
  group: z.string(),
  sensitive: z.boolean(),
});

export type CapabilityInfoData = z.infer<typeof CapabilityInfoSchema>;
