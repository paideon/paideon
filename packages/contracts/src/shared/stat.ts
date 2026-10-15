import { z } from 'zod';

export const TrendDirectionEnum = z.enum(['up', 'down', 'neutral']);

export const StatCardVariantEnum = z.enum(['single', 'with-trend']);

export const TrendPropsSchema = z.object({
  direction: TrendDirectionEnum,
  value: z.string(),
  label: z.string().optional(),
});

export const StatSchema = z.object({
  id: z.string(),
  target: z.number(),
  label: z.string(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  description: z.string().optional(),
  tooltip: z
    .object({
      content: z.string(),
      position: z.enum(['top', 'bottom', 'left', 'right']).optional(),
    })
    .optional(),
  disableCountUp: z.boolean().optional(),
  trend: TrendPropsSchema.optional(),
});

export type TrendDirectionType = z.infer<typeof TrendDirectionEnum>;
export type StatCardVariantType = z.infer<typeof StatCardVariantEnum>;
export type StatData = z.infer<typeof StatSchema>;
