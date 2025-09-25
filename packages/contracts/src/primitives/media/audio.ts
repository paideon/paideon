// packages/contracts/src/primitives/media/audio.ts

import { z } from 'zod';

export const AudioSchema = z.object({
  src: z.string(), // R2 key
  title: z.string(),
  duration: z.number().optional(), // seconds
  transcriptUrl: z.string().optional(),
});

export type AudioData = z.infer<typeof AudioSchema>;
