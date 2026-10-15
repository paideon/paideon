import { z } from 'zod';

export const NewsCardVariant = z.enum(['featured', 'standard', 'compact']);

// Card projection, matching NewsCardProps in @paideon/ui.
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
