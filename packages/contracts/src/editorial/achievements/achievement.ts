// School-wide achievements. Facts, not per-locale prose, so there is no
// locale field.

import { z } from 'zod';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../constants/index.ts';
import { ImageSchema } from '../../primitives/index.ts';

export const AchievementLevel = z.enum([
  'national',
  'provincial',
  'district',
  'school',
]);

export const AchievementCategory = z.enum([
  'academic',
  'sports',
  'arts',
  'competition',
]);

// Display labels, so admin and public UI show the same formatted text.
export const ACHIEVEMENT_CATEGORY_LABELS: Record<
  z.infer<typeof AchievementCategory>,
  string
> = {
  academic: 'Academic',
  sports: 'Sports',
  arts: 'Arts',
  competition: 'Competition',
};

export const ACHIEVEMENT_LEVEL_LABELS: Record<
  z.infer<typeof AchievementLevel>,
  string
> = {
  national: 'National',
  provincial: 'Provincial',
  district: 'District',
  school: 'School',
};

export const AchievementSchema = z.object({
  id: z.string(),
  studentName: z.string().min(1).max(MAX_TITLE_LENGTH),
  title: z.string().max(MAX_TITLE_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  level: AchievementLevel,
  category: AchievementCategory,
  date: z.string(), // ISO date
  awardedBy: z.string().optional(),
  // Plain id reference: never embed the news article's own schema here.
  relatedNewsArticleId: z.string().optional(),
  image: ImageSchema.optional(),
});

// Card projection, matching AchievementCardProps in @paideon/ui.
export const AchievementCardSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  title: z.string(),
  year: z.string(),
  category: z.string().optional(),
  context: z.string().optional(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  href: z.string().optional(),
});

export type AchievementData = z.infer<typeof AchievementSchema>;
export type AchievementLevelData = z.infer<typeof AchievementLevel>;
export type AchievementCategoryData = z.infer<typeof AchievementCategory>;
export type AchievementCardData = z.infer<typeof AchievementCardSchema>;
