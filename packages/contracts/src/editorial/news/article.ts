// packages/contracts/src/editorial/news/article.ts
//
// News article contract.
//
// NewsArticleSchema     — @deprecated, see below.
// ArticleCardSchema     — lighter projection for list views (used by @paideon/ui's
//                         NewsCard) — still live, populated from the real
//                         NewsArticle domain model (packages/api/src/modules/news)
//                         as of M3, not from NewsArticleSchema below.
//
// Notes:
//   Category reuses NewsCategorySchema from category.ts rather than a
//   separate ArticleCategory enum.

import { z } from "zod";

import { NewsCategorySchema } from "./category.ts";
import {
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../../constants/index.ts";
import {
  ImageSchema,
  LocaleEnum,
  RichTextSchema,
  SeoSchema,
} from "../../primitives/index.ts";

export const NEWS_ARTICLE_CONTENT_TYPE = "news-article";

/**
 * @deprecated Superseded as of M3 by the real `NewsArticle` Prisma model
 * (packages/database/prisma/schema.prisma) and its validators in
 * packages/api/src/modules/news/validators.ts. This schema described a
 * ContentEntry-stored article from when News was still a "deferred domain
 * model" (F-057) — nothing constructs data against it anymore. Kept in
 * place (not deleted) only because it's a public package export; new code
 * should use the news module's own types, not this.
 */
export const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string().max(MAX_TITLE_LENGTH),
  slug: z.string(),
  excerpt: z.string().max(MAX_DESCRIPTION_LENGTH),
  content: RichTextSchema,
  coverImage: ImageSchema.optional(),
  category: NewsCategorySchema,
  author: z.string().optional(),
  publishedAt: z.string(), // ISO datetime
  tags: z.array(z.string()).optional(),
  seo: SeoSchema.optional(),
  locale: LocaleEnum,
});

export type NewsArticleData = z.infer<typeof NewsArticleSchema>;

export const NewsCardVariant = z.enum(["featured", "standard", "compact"]);

// Card projection — matches @paideon/ui's NewsCardProps exactly.
export const ArticleCardSchema = z.object({
  variant: NewsCardVariant.optional(),
  title: z.string(),
  excerpt: z.string().optional(),
  category: z.string(),
  date: z.string(),
  href: z.string(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  readTime: z.string().optional(),
});

export type ArticleCardData = z.infer<typeof ArticleCardSchema>;
export type NewsCardVariantType = z.infer<typeof NewsCardVariant>;

export const NewsCardVariantValues = NewsCardVariant.enum;
