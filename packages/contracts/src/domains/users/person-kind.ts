// What KIND of person an account belongs to. This is descriptive only: it
// decides which profile table holds their details, their ID prefix and their
// library loan limit. It grants nothing; permissions come only from
// capability grants (capability.ts).
//
// Mirrors the Prisma `PersonKind` enum in packages/database exactly. Contracts
// cannot import the Prisma client, so keep this list in sync by hand.

import { z } from 'zod';

export const PERSON_KIND_VALUES = [
  'STUDENT',
  'TEACHER',
  'PARENT',
  'STAFF',
] as const;

export const PersonKindEnum = z.enum(PERSON_KIND_VALUES);

export type PersonKindEnumData = z.infer<typeof PersonKindEnum>;
