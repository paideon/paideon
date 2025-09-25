// packages/contracts/src/features/people/principal.ts

// Principal profile and message contracts.

import { z } from 'zod';

export const PrincipalSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  image: z.string().optional(),
  bio: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
});

export const PrincipalMessageSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  signature: z.string().optional(),
});

export type PrincipalData = z.infer<typeof PrincipalSchema>;
export type PrincipalMessageData = z.infer<typeof PrincipalMessageSchema>;
