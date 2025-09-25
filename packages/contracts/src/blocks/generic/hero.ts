// packages/contracts/src/blocks/generic/hero.ts
// Defines the validated data shape for reusable hero section blocks.

import { z } from 'zod';

import { HERO_BLOCK } from '../block-type.js';

export const HeroSchema = z.object({
  blockType: z.literal(HERO_BLOCK),
  eyebrow: z.string(),
  title: z.string(),
  titleEm: z.string().optional(),
  subtitle: z.string().optional(),
});

export type HeroData = z.infer<typeof HeroSchema>;
