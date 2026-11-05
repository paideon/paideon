// The signed-in person, as returned by GET /api/auth/me.

import { z } from 'zod';
import { AccountStatusEnum } from './account-status.ts';
import { CapabilityGrantSchema } from './capability.ts';
import { PersonKindEnum } from './person-kind.ts';

export const CurrentUserSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  paideonId: z.string(),
  email: z.string(),
  kind: PersonKindEnum,
  status: AccountStatusEnum,
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().nullable(),
  cardNumber: z.string(),
  photoUrl: z.string().nullable(),
  capabilities: z.array(CapabilityGrantSchema),
});

export type CurrentUserData = z.infer<typeof CurrentUserSchema>;
