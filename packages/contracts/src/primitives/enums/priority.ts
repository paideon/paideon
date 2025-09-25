// packages/contracts/src/primitives/enums/priority.ts

import { z } from 'zod';

export const PRIORITY_VALUES = ['low', 'medium', 'high', 'urgent'] as const;

export const PriorityEnum = z.enum(PRIORITY_VALUES);

export type PriorityEnumData = z.infer<typeof PriorityEnum>;
