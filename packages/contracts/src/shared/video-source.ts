import { z } from 'zod';

export const VideoSource = z.enum(['youtube', 'vimeo', 'direct']);

export type VideoSourceType = z.infer<typeof VideoSource>;
