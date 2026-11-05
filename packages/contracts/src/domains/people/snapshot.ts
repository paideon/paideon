// GET /api/stats/snapshot: the numbers on the People landing page.

import { z } from 'zod';
import { StatSchema } from '../../shared/stat.ts';

export const SchoolSnapshotSchema = z.object({
  students: z.number().int().nonnegative(),
  teachers: z.number().int().nonnegative(),
  staff: z.number().int().nonnegative(),
  /** Accounts still waiting to be activated (never signed in). */
  accountsNotActivated: z.number().int().nonnegative(),
  /** Active students with something missing (photo, guardian phone, class). */
  recordsMissingData: z.number().int().nonnegative(),
  academicYear: z.string().nullable(),
});
export type SchoolSnapshotData = z.infer<typeof SchoolSnapshotSchema>;

/** Turns the snapshot into the StatCard rows the page shows. */
export function snapshotToStats(
  snapshot: SchoolSnapshotData,
): z.infer<typeof StatSchema>[] {
  return [
    { id: 'students', target: snapshot.students, label: 'Students' },
    { id: 'teachers', target: snapshot.teachers, label: 'Teachers' },
    { id: 'staff', target: snapshot.staff, label: 'Staff' },
    {
      id: 'not-activated',
      target: snapshot.accountsNotActivated,
      label: 'Accounts not activated',
    },
    {
      id: 'missing-data',
      target: snapshot.recordsMissingData,
      label: 'Records missing data',
    },
  ];
}
