// packages/contracts/src/features/contact/feedback.ts

// Feedback form input contract.

import { z } from 'zod';

export const FeedbackCategoryEnum = z.enum([
  'website',
  'academic',
  'facilities',
  'staff',
  'other',
]);

export const FeedbackFormSchema = z.object({
  category: FeedbackCategoryEnum,
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().min(10),
  isAnonymous: z.boolean().optional(),
  email: z.string().email().optional(),
});

export type FeedbackCategoryEnumData = z.infer<typeof FeedbackCategoryEnum>;
export type FeedbackFormData = z.infer<typeof FeedbackFormSchema>;
