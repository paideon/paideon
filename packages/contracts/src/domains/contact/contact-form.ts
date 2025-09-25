// packages/contracts/src/features/contact/form.ts

// General contact form input contract.

import { z } from 'zod';

import { LocaleEnum } from '../../primitives/locale.ts';

export const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  locale: LocaleEnum,
  message: z.string().min(20).max(2000),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
