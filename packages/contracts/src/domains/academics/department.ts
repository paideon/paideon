// packages/contracts/src/features/academics/department.ts

// Academic department contracts.

import { z } from 'zod';

export const DepartmentKeyEnum = z.enum([
  'mathematics',
  'science',
  'languages',
  'commerce',
  'arts',
  'technology',
  'physical-education',
  'religion',
]);

export const DepartmentSchema = z.object({
  key: DepartmentKeyEnum,
  name: z.string().min(1),
  head: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export type DepartmentKeyEnumData = z.infer<typeof DepartmentKeyEnum>;
export type DepartmentData = z.infer<typeof DepartmentSchema>;
