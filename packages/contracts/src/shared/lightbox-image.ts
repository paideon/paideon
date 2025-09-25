// packages/contracts/src/shared/lightbox-image.ts

// Should contain:
//   LightboxImageSchema — src, alt, caption?
//   LightboxImageData   — z.infer type

import { z } from 'zod';

import { ImageSchema } from '../primitives/index.ts';

export const LightboxImageSchema = ImageSchema.pick({
  src: true,
  alt: true,
  caption: true,
});

export type LightboxImageData = z.infer<typeof LightboxImageSchema>;
