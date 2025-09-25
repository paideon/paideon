// packages/contracts/src/blocks/generic/announcement.ts
// Defines the validated data shape for announcement-style notice blocks.

import { z } from 'zod';

import { ANNOUNCEMENT_BLOCK } from '../block-type.js';

export const AnnouncementSchema = z.object({
  blockType: z.literal(ANNOUNCEMENT_BLOCK),
  variant: z.enum(['info', 'warning', 'error', 'success']).default('info'),
  message: z.string(),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type AnnouncementData = z.infer<typeof AnnouncementSchema>;
