// A class (grade + section) in an academic year, for pickers and filters.

import { z } from 'zod';

export const ClassSummarySchema = z.object({
  id: z.string(),
  grade: z.number().int(),
  section: z.string(),
  /** "10-A" */
  label: z.string(),
  studentCount: z.number().int().nonnegative(),
});
export type ClassSummaryData = z.infer<typeof ClassSummarySchema>;

export const ClassListSchema = z.array(ClassSummarySchema);
export type ClassListData = z.infer<typeof ClassListSchema>;

export function classLabel(grade: number, section: string): string {
  return `${grade}-${section}`;
}
