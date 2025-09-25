// packages/contracts/src/blocks/page-specific/anthem.ts
// Defines the data shape for anthem-style page blocks.

import { z } from 'zod';

import { ANTHEM_BLOCK } from '../block-type.js';

export const AnthemSchema = z.object({
  blockType: z.literal(ANTHEM_BLOCK),
  eyebrow: z.string().optional(),
  heading: z.string(),
  paragraph: z.string().optional(),
  anthemSrc: z.string(),
  playerTitle: z.string(),
  playerSubtitle: z.string().optional(),
  lyricsSinhala: z.string().optional(),
});
export type AnthemData = z.infer<typeof AnthemSchema>;
