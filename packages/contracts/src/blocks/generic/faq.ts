// packages/contracts/src/blocks/generic/faq.ts
// Defines the schema for FAQ content and its individual questions.

import { z } from 'zod';

import { FAQ_BLOCK } from '../block-type.js';

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const FaqSchema = z.object({
  blockType: z.literal(FAQ_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(FaqItemSchema),
});

export type FaqData = z.infer<typeof FaqSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
