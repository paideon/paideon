// packages/contracts/src/editorial/achievements/achievement.ts
//
// School-level achievement contract (Task 7.19, F-156/F-181).
//
// AchievementSchema     — the full entity: id, title, description?, level,
//                         category, date (ISO), awardedBy?, image? (R2 key)
// AchievementCardSchema — lighter projection for grid display (used by @paideon/ui)
// AchievementInputSchema — create/update input for admin forms
// AchievementOutputSchema — API output with serialized image
//
// Notes:
//   School-wide achievements — distinct from features/societies/achievement.ts
//   (which is specific to a single society).
//   Used on the home page achievement section and a dedicated achievements list.
//   No locale field — achievements are facts, not per-locale prose.

import { z } from "zod";

import {
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../../constants/index.ts";
import { ImageSchema } from "../../primitives/index.ts";

export const ACHIEVEMENT_CONTENT_TYPE = "achievement";

export const AchievementLevel = z.enum([
  "national",
  "provincial",
  "district",
  "school",
]);

// F-181 specifies academic/sports/arts/competition — was academic/sports/
// cultural/other here with no documented rationale for the divergence
// (unlike News's category taxonomy, which has one). Feature Registry is the
// scope source of truth, so this fixes the drift rather than the doc.
export const AchievementCategory = z.enum([
  "academic",
  "sports",
  "arts",
  "competition",
]);

// Display labels — shared so admin and public consumers show the same
// formatted text instead of the raw enum value. Matches
// domains/archive/archive.ts's ARCHIVE_CATEGORY_LABELS pattern; previously
// apps/admin/src/lib/achievements.ts declared its own local copy of the
// category one and the web app had no equivalent at all.
export const ACHIEVEMENT_CATEGORY_LABELS: Record<
  z.infer<typeof AchievementCategory>,
  string
> = {
  academic: "Academic",
  sports: "Sports",
  arts: "Arts",
  competition: "Competition",
};

export const ACHIEVEMENT_LEVEL_LABELS: Record<
  z.infer<typeof AchievementLevel>,
  string
> = {
  national: "National",
  provincial: "Provincial",
  district: "District",
  school: "School",
};

// The full entity — CMS/admin CRUD and database storage.
export const AchievementSchema = z.object({
  id: z.string(),
  studentName: z.string().min(1).max(MAX_TITLE_LENGTH),
  title: z.string().max(MAX_TITLE_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  level: AchievementLevel,
  category: AchievementCategory,
  date: z.string(), // ISO date
  awardedBy: z.string().optional(),
  // Opaque cross-reference to a NewsArticle — never import NewsArticle's
  // own schema here, per Contracts.md's tier-4 rule that editorial/domains
  // concepts reference each other by plain id string, not by relation.
  relatedNewsArticleId: z.string().optional(),
  image: ImageSchema.optional(),
});

export type AchievementData = z.infer<typeof AchievementSchema>;
export type AchievementLevelData = z.infer<typeof AchievementLevel>;
export type AchievementCategoryData = z.infer<typeof AchievementCategory>;

// Input schema for create/update operations.
export const AchievementInputSchema = z.object({
  studentName: z.string().min(1).max(MAX_TITLE_LENGTH),
  title: z.string().min(1).max(MAX_TITLE_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  level: AchievementLevel,
  category: AchievementCategory,
  date: z.string(),
  awardedBy: z.string().optional(),
  relatedNewsArticleId: z.string().optional(),
  image: ImageSchema.optional(),
});

export const AchievementUpdateSchema = AchievementInputSchema.partial().extend({
  id: z.string().min(1),
});

export type AchievementInput = z.infer<typeof AchievementInputSchema>;
export type AchievementUpdate = z.infer<typeof AchievementUpdateSchema>;

// Output schema with serialized image (from flattened storage).
export const AchievementOutputSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  level: AchievementLevel,
  category: AchievementCategory,
  date: z.string(),
  awardedBy: z.string().nullable(),
  relatedNewsArticleId: z.string().nullable(),
  image: ImageSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AchievementOutput = z.infer<typeof AchievementOutputSchema>;

// Card projection — matches @paideon/ui's AchievementCardProps exactly.
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

export type AchievementCardData = z.infer<typeof AchievementCardSchema>;
