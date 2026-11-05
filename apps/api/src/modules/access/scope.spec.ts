import type { CapabilityGrantData } from '@paideon/contracts';
import { holds, holdsSchoolWide, reachFor, reachIncludes } from './scope';

const grants: CapabilityGrantData[] = [
  { capability: 'people.read', scope: 'GRADE:7' },
  { capability: 'people.read', scope: 'GRADE:8' },
  { capability: 'people.read', scope: 'CLASS:abc' },
  { capability: 'stats.view', scope: 'SCHOOL' },
];

describe('capability scopes', () => {
  it('collects every scope held for one capability', () => {
    expect(reachFor(grants, 'people.read')).toEqual({
      school: false,
      grades: [7, 8],
      classIds: ['abc'],
    });
  });

  it('holds a capability at any scope, school-wide only for SCHOOL', () => {
    expect(holds(grants, 'people.read')).toBe(true);
    expect(holdsSchoolWide(grants, 'people.read')).toBe(false);
    expect(holdsSchoolWide(grants, 'stats.view')).toBe(true);
    expect(holds(grants, 'people.write')).toBe(false);
  });

  it('includes a student by grade or class, or everyone at school scope', () => {
    const reach = reachFor(grants, 'people.read');
    expect(reachIncludes(reach, { grade: 7, classId: null })).toBe(true);
    expect(reachIncludes(reach, { grade: 10, classId: 'abc' })).toBe(true);
    expect(reachIncludes(reach, { grade: 10, classId: 'zzz' })).toBe(false);
    expect(reachIncludes(reach, { grade: null, classId: null })).toBe(false);
    expect(
      reachIncludes(reachFor(grants, 'stats.view'), {
        grade: 1,
        classId: null,
      }),
    ).toBe(true);
  });
});
