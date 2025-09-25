// packages/contracts/src/blocks/generic/cta.ts
// Defines the validated data shape for call-to-action blocks.

import { z } from 'zod';

import { CTA_BLOCK } from '../block-type.js';

export const CtaSchema = z.object({
  blockType: z.literal(CTA_BLOCK),
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  buttonLabel: z.string(),
  buttonHref: z.string(),
  secondaryButtonLabel: z.string().optional(),
  secondaryButtonHref: z.string().optional(),
});

export type CtaData = z.infer<typeof CtaSchema>;
