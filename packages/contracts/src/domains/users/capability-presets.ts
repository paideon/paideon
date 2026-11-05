// Presets: named bundles of capability grants, used to give a person a usual
// set of permissions in one step. The database stores only the grants, never
// the preset name, so a person can later be given more or fewer.
//
// Presets that need a scope (a section head covers ONE grade, a class teacher
// ONE class) take it as an argument. The data-entry preset is left out until
// the pending decision about volunteer access is made.

import {
  CAPABILITY_VALUES,
  type CapabilityEnumData,
  type CapabilityGrantData,
  type CapabilityScopeData,
} from './capability.ts';

export const PRESET_VALUES = [
  'ADMIN',
  'PRINCIPAL',
  'SECTION_HEAD',
  'CLASS_TEACHER',
  'CLERK',
  'LIBRARIAN',
] as const;

export type PresetName = (typeof PRESET_VALUES)[number];

type PresetSpec = {
  /** The preset applies to GRADE:n or CLASS:id instead of the whole school. */
  scoped?: 'GRADE' | 'CLASS';
  capabilities: readonly CapabilityEnumData[];
};

export const CAPABILITY_PRESETS: Record<PresetName, PresetSpec> = {
  ADMIN: { capabilities: CAPABILITY_VALUES },
  PRINCIPAL: {
    capabilities: [
      'people.read',
      'people.sensitive.read',
      'stats.view',
      'stats.sensitive',
      'library.reports',
      'audit.view',
    ],
  },
  SECTION_HEAD: {
    scoped: 'GRADE',
    capabilities: ['people.read', 'stats.view'],
  },
  CLASS_TEACHER: { scoped: 'CLASS', capabilities: ['people.read'] },
  CLERK: {
    capabilities: [
      'people.read',
      'people.sensitive.read',
      'people.write',
      'accounts.manage',
      'school.manage',
      'entry.use',
      'entry.coordinate',
    ],
  },
  LIBRARIAN: {
    capabilities: [
      'library.desk',
      'library.members.read',
      'library.manage',
      'library.fines',
      'library.reports',
    ],
  },
};

/** The grants a preset stands for. Pass `scope` for GRADE and CLASS presets. */
export function grantsForPreset(
  preset: PresetName,
  scope?: CapabilityScopeData,
): CapabilityGrantData[] {
  const spec = CAPABILITY_PRESETS[preset];
  if (spec.scoped) {
    if (!scope || !scope.startsWith(`${spec.scoped}:`)) {
      throw new Error(`The ${preset} preset needs a ${spec.scoped}:... scope.`);
    }
  } else if (scope !== undefined && scope !== 'SCHOOL') {
    throw new Error(`The ${preset} preset covers the whole school.`);
  }
  return spec.capabilities.map((capability) => ({
    capability,
    scope: spec.scoped ? (scope as CapabilityScopeData) : 'SCHOOL',
  }));
}
