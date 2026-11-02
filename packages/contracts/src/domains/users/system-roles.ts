// System roles and the rule that turns roles and grants into capabilities.
//
// A ROLE is a named bundle of capabilities stored in the database. The
// super admin can edit which capabilities a role holds, create new roles, give
// a person roles, or give a person single extra capabilities ("grants").
// The roles below are only the starting set: the server creates them for a
// school the first time it starts, and never overwrites later edits.
//
// Code never checks a role. It checks capabilities.

import type {
  CapabilityEnumData,
  CapabilityGrantData,
  CapabilityScopeData,
} from './capability.ts';
import { CAPABILITY_VALUES } from './capability.ts';
import { expandGrants } from './capability-registry.ts';
import type { RoleEnumData } from './role.ts';

export type SystemRoleDefinition = {
  /** Stable key used by code and the seed. Lowercase, hyphens. */
  key: string;
  name: string;
  description: string;
  capabilities: readonly CapabilityEnumData[];
  /**
   * Kinds of person (the legacy `User.role` column) who hold this role
   * without being given it. Reader is held by everyone who may borrow.
   */
  defaultForKinds: readonly RoleEnumData[];
  /** Locked roles cannot be edited or deleted, and always hold everything. */
  locked: boolean;
};

export const SYSTEM_ROLES: readonly SystemRoleDefinition[] = [
  {
    key: 'reader',
    name: 'Reader',
    description:
      'Searches the catalog and sees their own loans, due dates, fines and history.',
    capabilities: ['library.catalog.read', 'library.own.read'],
    defaultForKinds: ['STUDENT', 'TEACHER', 'STAFF', 'LIBRARIAN', 'ADMIN'],
    locked: false,
  },
  {
    key: 'librarian',
    name: 'Librarian',
    description: 'Controls the books and runs the circulation desk.',
    capabilities: [
      'library.desk',
      'library.manage',
      'library.members.read',
      'library.fines',
      'library.reports',
    ],
    defaultForKinds: [],
    locked: false,
  },
  {
    key: 'super-admin',
    name: 'Super admin',
    description:
      'Holds every capability, always. Decides what the other roles can do.',
    capabilities: CAPABILITY_VALUES,
    defaultForKinds: [],
    locked: true,
  },
];

export const SYSTEM_ROLE_KEYS = SYSTEM_ROLES.map((role) => role.key);

/** The legacy account kind -> the role a first-time setup gives it. */
export const LEGACY_KIND_ROLE_KEY: Partial<Record<RoleEnumData, string>> = {
  LIBRARIAN: 'librarian',
  ADMIN: 'super-admin',
};

export type RoleHeld = {
  capabilities: readonly CapabilityEnumData[];
  scope: CapabilityScopeData;
};

export type GrantHeld = {
  capability: CapabilityEnumData;
  scope: CapabilityScopeData;
  /** A grant past this moment no longer counts. */
  expiresAt?: Date | null;
};

/**
 * What a person may do: everything their roles hold, plus their direct
 * grants that have not expired, plus what those imply.
 */
export function resolveCapabilities(input: {
  roles: readonly RoleHeld[];
  grants: readonly GrantHeld[];
  now?: Date;
}): CapabilityGrantData[] {
  const now = input.now ?? new Date();
  const collected: CapabilityGrantData[] = [];

  for (const role of input.roles) {
    for (const capability of role.capabilities) {
      collected.push({ capability, scope: role.scope });
    }
  }
  for (const grant of input.grants) {
    if (grant.expiresAt && grant.expiresAt.getTime() <= now.getTime()) continue;
    collected.push({ capability: grant.capability, scope: grant.scope });
  }

  return expandGrants(collected);
}

/** Capabilities of a set of system roles, school-wide. For tests and previews. */
export function grantsForSystemRoles(
  keys: readonly string[],
): CapabilityGrantData[] {
  const roles: RoleHeld[] = SYSTEM_ROLES.filter((role) =>
    keys.includes(role.key),
  ).map((role) => ({ capabilities: role.capabilities, scope: 'SCHOOL' }));
  return resolveCapabilities({ roles, grants: [] });
}
