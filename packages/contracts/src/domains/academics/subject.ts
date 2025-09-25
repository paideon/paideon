// packages/contracts/src/features/academics/subject.ts

// Subject contracts.

import { z } from 'zod';

import { ALStreamSchema } from './al-stream.ts';
import { DepartmentKeyEnum } from './department.ts';

export const SubjectLevelEnum = z.enum(['OL', 'AL', 'both']);

export const SubjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().optional(),
  level: SubjectLevelEnum,
  streams: z.array(ALStreamSchema).optional(),
  department: DepartmentKeyEnum.optional(),
  description: z.string().optional(),
});

export type SubjectLevelEnumData = z.infer<typeof SubjectLevelEnum>;
export type SubjectData = z.infer<typeof SubjectSchema>;
