// INTERIM: until the database stores capability grants (foundations section
// 10, item 7), a person's capabilities are derived from their single `role`.
//
// Only the presets the current Role enum can express are listed. The finer
// presets (principal, section head, class teacher, clerk, data-entry) need
// per-person grants and cannot be told apart by role alone yet.

import {
  CAPABILITY_VALUES,
  type CapabilityEnumData,
  type CapabilityGrantData,
} from './capability.ts';
import type { RoleEnumData } from './role.ts';

const LIBRARY_CAPABILITIES: readonly CapabilityEnumData[] = [
  'library.desk',
  'library.members.read',
  'library.manage',
  'library.fines',
  'library.reports',
];

const schoolWide = (
  capabilities: readonly CapabilityEnumData[],
): CapabilityGrantData[] =>
  capabilities.map((capability) => ({ capability, scope: 'SCHOOL' }));

export function capabilitiesForRole(role: RoleEnumData): CapabilityGrantData[] {
  switch (role) {
    case 'ADMIN':
      return schoolWide(CAPABILITY_VALUES);
    case 'LIBRARIAN':
      return schoolWide(LIBRARY_CAPABILITIES);
    default:
      // STUDENT, PARENT: own data only. TEACHER and STAFF: wait for grants.
      return [];
  }
}
