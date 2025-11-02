// The capability catalogue: what each capability means, which ones are
// sensitive, and which ones come with others. The access screen reads this to
// list what a role can hold; the server uses CAPABILITY_IMPLIES when it works
// out what a person may do.
//
// Adding a capability: add its name to CAPABILITY_VALUES (capability.ts), add
// a row here (TypeScript will insist), then check it on the server.

import {
  CAPABILITY_VALUES,
  type CapabilityEnumData,
  type CapabilityGrantData,
} from './capability.ts';

export type CapabilityInfo = {
  label: string;
  description: string;
  group: 'People' | 'School' | 'Data entry' | 'Stats' | 'Library' | 'System';
  /** Never bundled into a general role by accident; granted on purpose. */
  sensitive: boolean;
};

export const CAPABILITY_CATALOG: Record<CapabilityEnumData, CapabilityInfo> = {
  'people.read': {
    label: 'See people',
    description: 'See student, teacher and staff records (by scope).',
    group: 'People',
    sensitive: false,
  },
  'people.sensitive.read': {
    label: 'See religion and ethnicity',
    description: 'See the religion and ethnicity fields on people records.',
    group: 'People',
    sensitive: true,
  },
  'people.write': {
    label: 'Edit people',
    description: 'Create and edit students, teachers and staff.',
    group: 'People',
    sensitive: false,
  },
  'accounts.manage': {
    label: 'Manage accounts',
    description: 'Invite people, reset passwords and deactivate accounts.',
    group: 'People',
    sensitive: false,
  },
  'school.manage': {
    label: 'Manage school structure',
    description: 'Academic years, classes, subjects and streams.',
    group: 'School',
    sensitive: false,
  },
  'entry.use': {
    label: 'Use data-entry tools',
    description: 'Enter records through the quick grids and imports.',
    group: 'Data entry',
    sensitive: false,
  },
  'entry.coordinate': {
    label: 'Coordinate data entry',
    description: 'Progress dashboard, review queue and undoing a batch.',
    group: 'Data entry',
    sensitive: false,
  },
  'stats.view': {
    label: 'See school statistics',
    description: 'School statistics (by scope).',
    group: 'Stats',
    sensitive: false,
  },
  'stats.sensitive': {
    label: 'See religion and ethnicity statistics',
    description: 'Religion and ethnicity breakdowns in the statistics.',
    group: 'Stats',
    sensitive: true,
  },
  'library.catalog.read': {
    label: 'Search the catalog',
    description: 'Search books and see whether a copy is on the shelf.',
    group: 'Library',
    sensitive: false,
  },
  'library.own.read': {
    label: 'See my own library record',
    description: 'See my own borrowed books, due dates, fines and history.',
    group: 'Library',
    sensitive: false,
  },
  'library.desk': {
    label: 'Run the circulation desk',
    description: 'Check out, return and renew books.',
    group: 'Library',
    sensitive: false,
  },
  'library.members.read': {
    label: 'See library members',
    description: "See anyone's borrowing: loans, history and fines.",
    group: 'Library',
    sensitive: false,
  },
  'library.manage': {
    label: 'Manage books',
    description:
      'Add and edit books and copies, import, print labels and cards.',
    group: 'Library',
    sensitive: false,
  },
  'library.fines': {
    label: 'Collect and waive fines',
    description: 'Record payments and waive fines.',
    group: 'Library',
    sensitive: false,
  },
  'library.reports': {
    label: 'See library reports',
    description: 'Overdue lists, circulation and inventory reports.',
    group: 'Library',
    sensitive: false,
  },
  'settings.manage': {
    label: 'Manage settings',
    description: 'School settings, loan limits and message templates.',
    group: 'System',
    sensitive: false,
  },
  'access.manage': {
    label: 'Manage access',
    description:
      'Change what roles can do and give people roles or extra capabilities.',
    group: 'System',
    sensitive: true,
  },
  'audit.view': {
    label: 'See the audit log',
    description: 'Who changed what, and when.',
    group: 'System',
    sensitive: true,
  },
};

// Holding the key capability also gives the ones listed, at the same scope.
// This stops a half-configured role from breaking a screen: a person who can
// run the desk must be able to search the catalog and look up a member.
export const CAPABILITY_IMPLIES: Partial<
  Record<CapabilityEnumData, readonly CapabilityEnumData[]>
> = {
  'library.desk': ['library.catalog.read', 'library.members.read'],
  'library.manage': ['library.catalog.read'],
  'library.fines': ['library.members.read'],
};

export const SENSITIVE_CAPABILITIES: readonly CapabilityEnumData[] =
  CAPABILITY_VALUES.filter(
    (capability) => CAPABILITY_CATALOG[capability].sensitive,
  );

const ORDER = new Map<string, number>(CAPABILITY_VALUES.map((c, i) => [c, i]));

/**
 * Add the capabilities each grant implies, drop duplicates, and drop a
 * GRADE/CLASS grant when the same capability is already held school-wide.
 * The result is sorted in catalogue order so it is stable.
 */
export function expandGrants(
  grants: readonly CapabilityGrantData[],
): CapabilityGrantData[] {
  const all = new Map<string, CapabilityGrantData>();
  const add = (capability: CapabilityEnumData, scope: string) =>
    all.set(`${capability}|${scope}`, { capability, scope });

  for (const grant of grants) {
    add(grant.capability, grant.scope);
    for (const implied of CAPABILITY_IMPLIES[grant.capability] ?? []) {
      add(implied, grant.scope);
    }
  }

  const schoolWide = new Set(
    [...all.values()]
      .filter((grant) => grant.scope === 'SCHOOL')
      .map((grant) => grant.capability),
  );

  return [...all.values()]
    .filter(
      (grant) => grant.scope === 'SCHOOL' || !schoolWide.has(grant.capability),
    )
    .sort(
      (a, b) =>
        (ORDER.get(a.capability) ?? 0) - (ORDER.get(b.capability) ?? 0) ||
        a.scope.localeCompare(b.scope),
    );
}

/**
 * Does this set of grants include the capability? Without a scope the
 * question is "anywhere?"; with one, a school-wide grant covers it and
 * otherwise the scopes must match exactly. The server uses this to check a
 * request; the portal has the same rule in `can` and only uses it to hide
 * what the server would refuse.
 */
export function holdsCapability(
  grants: readonly CapabilityGrantData[],
  capability: CapabilityEnumData,
  scope?: string,
): boolean {
  return grants.some(
    (grant) =>
      grant.capability === capability &&
      (scope === undefined ||
        grant.scope === 'SCHOOL' ||
        grant.scope === scope),
  );
}
