// packages/contracts/src/features/societies/member.ts

// Society membership contracts.

import { z } from 'zod';

export const SocietyMemberRoleEnum = z.enum([
  'president',
  'secretary',
  'treasurer',
  'member',
  'alumni',
]);

export const SocietyMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: SocietyMemberRoleEnum,
  image: z.string().optional(),
  bio: z.string().optional(),
  year: z.string().optional(),
});

export type SocietyMemberRoleEnumData = z.infer<typeof SocietyMemberRoleEnum>;
export type SocietyMemberData = z.infer<typeof SocietyMemberSchema>;
