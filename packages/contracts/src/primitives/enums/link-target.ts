// packages/contracts/src/primitives/enums/link-target.ts

import { z } from 'zod';

export const LINK_TARGET_VALUES = ['self', 'blank'] as const;

export const LinkTargetEnum = z.enum(LINK_TARGET_VALUES);

export type LinkTargetEnumData = z.infer<typeof LinkTargetEnum>;
