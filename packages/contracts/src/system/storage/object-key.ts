// packages/contracts/src/system/storage/object-key.ts

// The validated, R2-style object key format.

import { z } from 'zod';

export const ObjectKeySchema = z
  .string()
  .regex(new RegExp('^[a-zA-Z0-9\\-_/.]+$'), 'Invalid R2 object key format');

export type ObjectKeyData = z.infer<typeof ObjectKeySchema>;
