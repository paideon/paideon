// packages/contracts/src/blocks/page-specific/staff-grid.ts
// Defines the schema for staff-grid blocks and member entries.

import { z } from 'zod';

import { STAFF_GRID_BLOCK } from '../block-type.js';

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string().optional(),
  bio: z.string().optional(),
});

export const MembersSchema = z.object({
  blockType: z.literal(STAFF_GRID_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  members: z.array(MemberSchema),
});

export type MembersData = z.infer<typeof MembersSchema>;
export type MemberItem = z.infer<typeof MemberSchema>;
