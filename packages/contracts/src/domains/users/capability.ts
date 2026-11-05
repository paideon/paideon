// Capabilities: what a person is allowed to do, and where.
//
// A capability is granted with a scope: the whole school, one grade, or one
// class. Presets are only named bundles of capabilities (see capability-presets.ts).
// The names below are the ones defined in 00-FOUNDATIONS.md section 4.

import { z } from 'zod';

export const CAPABILITY_VALUES = [
  'people.read',
  'people.sensitive.read',
  'people.write',
  'accounts.manage',
  'school.manage',
  'entry.use',
  'entry.coordinate',
  'stats.view',
  'stats.sensitive',
  'library.desk',
  'library.members.read',
  'library.manage',
  'library.fines',
  'library.reports',
  'settings.manage',
  'access.manage',
  'audit.view',
] as const;

export const CapabilityEnum = z.enum(CAPABILITY_VALUES);

export type CapabilityEnumData = z.infer<typeof CapabilityEnum>;

// 'SCHOOL', 'GRADE:7' or 'CLASS:<id>'.
export const CapabilityScopeSchema = z.union([
  z.literal('SCHOOL'),
  z.string().regex(/^GRADE:\d{1,2}$/, 'Invalid grade scope.'),
  z.string().regex(/^CLASS:[A-Za-z0-9_-]{1,64}$/, 'Invalid class scope.'),
]);

export type CapabilityScopeData = z.infer<typeof CapabilityScopeSchema>;

export const CapabilityGrantSchema = z.object({
  capability: CapabilityEnum,
  scope: CapabilityScopeSchema,
});

export type CapabilityGrantData = z.infer<typeof CapabilityGrantSchema>;
