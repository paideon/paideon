import { z } from 'zod';

import { AvatarSchema } from '../../primitives/media/index.ts';

export const SocietyCategoryEnum = z.enum([
  'academic',
  'sports',
  'arts',
  'technology',
]);

// Display labels for category selects and public category filters.
export const SOCIETY_CATEGORIES = {
  academic: 'Academic',
  sports: 'Sports',
  arts: 'Arts',
  technology: 'Technology',
} as const;

export type SocietyCategoryMeta = {
  key: SocietyCategoryEnumData;
  label: string;
};

export const SOCIETY_CATEGORY_META: SocietyCategoryMeta[] = Object.entries(
  SOCIETY_CATEGORIES,
).map(([key, label]) => ({
  key: key as SocietyCategoryEnumData,
  label,
}));

export const SocietyCardVariantEnum = z.enum(['hub-grid', 'featured']);

export const SocietyCardSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().optional(),
  category: SocietyCategoryEnum,
  logo: AvatarSchema.optional(),
  isFeatured: z.boolean().optional(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  memberCount: z.number().int().nonnegative().optional(),
  founded: z.string().optional(),
  href: z.string().min(1),
});

export type SocietyCategoryEnumData = z.infer<typeof SocietyCategoryEnum>;
export type SocietyCardVariantType = z.infer<typeof SocietyCardVariantEnum>;
export type SocietyCardData = z.infer<typeof SocietyCardSchema>;
