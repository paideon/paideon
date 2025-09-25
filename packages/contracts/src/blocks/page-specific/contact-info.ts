// packages/contracts/src/blocks/page-specific/contact-info.ts
// Defines the data shape for contact information blocks.

import { z } from 'zod';

import { CONTACT_INFO_BLOCK } from '../block-type.js';

export const ContactInfoSchema = z.object({
  blockType: z.literal(CONTACT_INFO_BLOCK),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  phone: z.string(),
  email: z.string(),
  officeHours: z.string().optional(),
  admissionsPhone: z.string().optional(),
  admissionsEmail: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
});

export type ContactInfoData = z.infer<typeof ContactInfoSchema>;
