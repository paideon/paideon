// Capability scopes, and what a set of grants allows.
//
// A grant is a capability plus a scope: 'SCHOOL', 'GRADE:7' or 'CLASS:<id>'.
// A wider scope includes the narrower ones, so SCHOOL covers every grade and
// class. These are plain functions so the rules can be tested on their own.

import type {
  CapabilityEnumData,
  CapabilityGrantData,
} from '@paideon/contracts';

/** Where a person may see or change records for one capability. */
export type CapabilityReach = {
  /** True when the whole school is covered. */
  school: boolean;
  /** Grades covered by GRADE:n grants (ignored when `school` is true). */
  grades: number[];
  /** Class ids covered by CLASS:id grants (ignored when `school` is true). */
  classIds: string[];
};

export const NO_REACH: CapabilityReach = {
  school: false,
  grades: [],
  classIds: [],
};

export function reachFor(
  grants: readonly CapabilityGrantData[],
  capability: CapabilityEnumData,
): CapabilityReach {
  const grades = new Set<number>();
  const classIds = new Set<string>();
  let school = false;
  for (const grant of grants) {
    if (grant.capability !== capability) continue;
    if (grant.scope === 'SCHOOL') school = true;
    else if (grant.scope.startsWith('GRADE:'))
      grades.add(Number(grant.scope.slice('GRADE:'.length)));
    else if (grant.scope.startsWith('CLASS:'))
      classIds.add(grant.scope.slice('CLASS:'.length));
  }
  return { school, grades: [...grades], classIds: [...classIds] };
}

export function hasAnyReach(reach: CapabilityReach): boolean {
  return reach.school || reach.grades.length > 0 || reach.classIds.length > 0;
}

/** True if the person holds the capability at any scope at all. */
export function holds(
  grants: readonly CapabilityGrantData[],
  capability: CapabilityEnumData,
): boolean {
  return hasAnyReach(reachFor(grants, capability));
}

/** True if the capability covers the whole school. */
export function holdsSchoolWide(
  grants: readonly CapabilityGrantData[],
  capability: CapabilityEnumData,
): boolean {
  return reachFor(grants, capability).school;
}

/** Does this reach include a person who is in `grade` and class `classId`? */
export function reachIncludes(
  reach: CapabilityReach,
  target: { grade: number | null; classId: string | null },
): boolean {
  if (reach.school) return true;
  if (target.grade !== null && reach.grades.includes(target.grade)) return true;
  if (target.classId !== null && reach.classIds.includes(target.classId))
    return true;
  return false;
}
