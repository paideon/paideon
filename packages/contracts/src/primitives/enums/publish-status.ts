// packages/contracts/src/primitives/enums/publish-status.ts

import { z } from 'zod';

export const PUBLISH_STATUS_VALUES = [
  'draft',
  'in-review',
  'published',
  'archived',
] as const;

export const PublishStatusEnum = z.enum(PUBLISH_STATUS_VALUES);

export type PublishStatusEnumData = z.infer<typeof PublishStatusEnum>;
