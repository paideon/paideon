// packages/contracts/src/shared/video-source.ts

import { z } from 'zod';
export const VideoSource = z.enum(['youtube', 'vimeo', 'direct']);
export type VideoSourceType = z.infer<typeof VideoSource>;

// Runtime enum values for comparisons
export const VideoSourceValues = VideoSource.enum;
