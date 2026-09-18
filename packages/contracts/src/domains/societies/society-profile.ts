// packages/contracts/src/domains/societies/society-profile.ts
//
// F-167 (Societies Module, Task 7.6): the full, persisted `Society` entity
// (name, slug, category, tagline, description, member count, founding
// year, logo, banner, advisor) lives as Zod I/O schemas in
// packages/api/src/modules/societies/validators.ts — the same layering
// modules/news/validators.ts and modules/events/validators.ts already
// established (see events/event.ts's header comment for the fullest
// explanation of why). What survives here is only what @paideon/ui's
// SocietyCard actually renders directly: SocietyCardSchema and the
// category taxonomy.

import { z } from "zod";

import { AvatarSchema } from "../../primitives/media/index.ts";

export const SocietyCategoryEnum = z.enum([
  "academic",
  "sports",
  "arts",
  "technology",
]);

/** Label map for the admin category `<Select>` and public category-filter
 * UI — added alongside SocietyCategoryEnum, matching
 * editorial/events/category.ts's EVENT_CATEGORIES/EVENT_CATEGORY_META
 * precedent exactly (this file previously had only the bare enum, with no
 * display-label source anywhere). */
export const SOCIETY_CATEGORIES = {
  academic: "Academic",
  sports: "Sports",
  arts: "Arts",
  technology: "Technology",
} as const;

export type SocietyCategoryMeta = {
  key: SocietyCategoryEnumData;
  label: string;
};

export const SOCIETY_CATEGORY_META: SocietyCategoryMeta[] = Object.entries(
  SOCIETY_CATEGORIES
).map(([key, label]) => ({
  key: key as SocietyCategoryEnumData,
  label,
}));

export const SocietyCardVariantEnum = z.enum(["hub-grid", "featured"]);

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
