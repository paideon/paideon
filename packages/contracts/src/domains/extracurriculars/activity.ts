// packages/contracts/src/domains/extracurriculars/activity.ts
//
// F-179 (Extracurriculars Module, Task 7.17): the full, persisted
// `ExtracurricularActivity`/`ExtracurricularAchievement` entities live as
// Zod I/O schemas in packages/api/src/modules/extracurriculars/validators.ts
// — the same layering modules/societies/validators.ts and
// modules/gallery/validators.ts already established (see
// domains/societies/society-profile.ts's header comment for the fullest
// explanation of why). What survives here is only what @paideon/ui's
// ExtracurricularCard actually renders directly: ActivitySchema and the
// category taxonomy.

import { z } from "zod";

import { ImageSchema } from "../../primitives/media/index.ts";

export const ExtracurricularCategoryEnum = z.enum([
  "sports",
  "performing-arts",
  "leadership",
]);

/** Label map for the admin category `<Select>` and the public F-161
 * listing page's category grouping — matching
 * domains/societies/society-profile.ts's SOCIETY_CATEGORIES/
 * SOCIETY_CATEGORY_META precedent exactly (this file previously had only
 * the bare enum, with no display-label source anywhere). */
export const EXTRACURRICULAR_CATEGORIES = {
  sports: "Sports",
  "performing-arts": "Performing Arts",
  leadership: "Leadership",
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
 * `ExtracurricularCard`'s own presentational variant — deliberately a
 * *different* string for the sports case ('sport', singular) than
 * `ExtracurricularCategoryEnum`'s 'sports' (plural, the stored taxonomy
 * value). Kept as a separate enum rather than reused directly: the card's
 * `variant` prop drives its visual treatment, while `category` drives
 * filtering/grouping — see CATEGORY_TO_CARD_VARIANT in
 * apps/web/src/lib/extracurricular-card.ts for the mapping between them.
 */
export const ExtracurricularVariantEnum = z.enum([
  "sport",
  "performing-arts",
  "leadership",
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
