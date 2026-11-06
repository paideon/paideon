// Which students a person's grants reach, as a database filter.

import type { Prisma } from '@paideon/database/generated/client/client';
import type { CapabilityReach } from '../access/scope';

/**
 * `reach` is what the person holds for people.read (or another capability).
 * School scope sees every student; GRADE:n sees students currently in grade n;
 * CLASS:id sees students enrolled in that class this academic year.
 */
export function studentScopeWhere(
  reach: CapabilityReach,
  currentYearId: string | null,
): Prisma.UserWhereInput {
  if (reach.school) return {};
  const any: Prisma.UserWhereInput[] = [];
  if (reach.grades.length > 0) {
    any.push({
      studentProfile: { is: { currentGrade: { in: reach.grades } } },
    });
  }
  if (reach.classIds.length > 0 && currentYearId) {
    any.push({
      classEnrollments: {
        some: {
          classId: { in: reach.classIds },
          academicYearId: currentYearId,
        },
      },
    });
  }
  // Nothing reachable: match no one.
  if (any.length === 0) return { id: { in: [] } };
  return { OR: any };
}

/** Combines two reaches: a student reachable by either is reachable. */
export function unionReach(
  a: CapabilityReach,
  b: CapabilityReach,
): CapabilityReach {
  return {
    school: a.school || b.school,
    grades: [...new Set([...a.grades, ...b.grades])],
    classIds: [...new Set([...a.classIds, ...b.classIds])],
  };
}
