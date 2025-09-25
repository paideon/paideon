// packages/contracts/src/blocks/generic/rich-text-block.ts
// Defines the validated data shape for rich-text content blocks.

import { z } from 'zod';

import { RICH_TEXT_BLOCK } from '../block-type.js';

export const RichTextBlockSchema = z.object({
  blockType: z.literal(RICH_TEXT_BLOCK),
  content: z.string(),
});
export type RichTextBlockData = z.infer<typeof RichTextBlockSchema>;
