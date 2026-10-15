import { z } from 'zod';

import { ImageSchema } from '../../primitives/media/index.ts';

export const ExtracurricularCategoryEnum = z.enum([
  'sports',
  'performing-arts',
  'leadership',
]);

// Display labels for category selects and grouped listings.
export const EXTRACURRICULAR_CATEGORIES = {
  sports: 'Sports',
  'performing-arts': 'Performing Arts',
  leadership: 'Leadership',
} as const;

export type ExtracurricularCategoryMeta = {
  key: ExtracurricularCategoryEnumData;
  label: string;
};

export const EXTRACURRICULAR_CATEGORY_META: ExtracurricularCategoryMeta[] =
  Object.entries(EXTRACURRICULAR_CATEGORIES).map(([key, label]) => ({
    key: key as ExtracurricularCategoryEnumData,
    label,
  }));

/**
 * ExtracurricularCard's presentational variant. Deliberately a different
 * string for the sports case ('sport', singular) than
 * `ExtracurricularCategoryEnum`'s 'sports' (the stored taxonomy value): the
 * variant drives the card's visual treatment, the category drives
 * filtering and grouping.
 */
export const ExtracurricularVariantEnum = z.enum([
  'sport',
  'performing-arts',
  'leadership',
]);

export const ActivitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: ExtracurricularCategoryEnum,
  description: z.string().min(1),
  image: ImageSchema.optional(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  teacherInCharge: z.string().optional(),
  recentAchievements: z.array(z.string()).optional(),
  studentQuote: z.string().optional(),
  season: z.string().optional(),
  href: z.string().optional(),
});

export type ExtracurricularCategoryEnumData = z.infer<
  typeof ExtracurricularCategoryEnum
>;
export type ExtracurricularVariantType = z.infer<
  typeof ExtracurricularVariantEnum
>;
export type ActivityData = z.infer<typeof ActivitySchema>;
