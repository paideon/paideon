// packages/contracts/src/system/rbac/permission.ts
//
// A resource/action permission pair.

import { z } from 'zod';

export const PermissionSchema = z.object({
  resource: z.string(),
  action: z.enum(['read', 'write', 'publish', 'admin']),
});

export type PermissionData = z.infer<typeof PermissionSchema>;
