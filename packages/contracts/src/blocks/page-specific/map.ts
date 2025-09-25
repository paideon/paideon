// packages/contracts/src/blocks/page-specific/map.ts
// Defines the data shape for map blocks.

import { z } from 'zod';

import { MAP_BLOCK } from '../block-type.js';

export const MapSchema = z.object({
  blockType: z.literal(MAP_BLOCK),
  embedUrl: z.string(),
  title: z.string().optional(),
  height: z.number().default(400),
  caption: z.string().optional(),
});

export type MapData = z.infer<typeof MapSchema>;
