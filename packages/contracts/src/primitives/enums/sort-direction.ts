// packages/contracts/src/primitives/enums/sort-direction.ts

import { z } from 'zod';

export const SORT_DIRECTION_VALUES = ['asc', 'desc'] as const;

export const SortDirectionEnum = z.enum(SORT_DIRECTION_VALUES);

export type SortDirectionEnumData = z.infer<typeof SortDirectionEnum>;
