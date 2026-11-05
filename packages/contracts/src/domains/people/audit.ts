// One audit entry as shown on a person's Activity tab.

import { z } from 'zod';
import { paginated } from '../../shared/pagination.ts';

export const AuditEntrySchema = z.object({
  id: z.string(),
  action: z.string(),
  /** Who did it; null for the system. */
  actor: z.object({
    paideonId: z.string().nullable(),
    name: z.string().nullable(),
  }),
  createdAt: z.string(),
  /** Field names that changed, for update entries. */
  changedFields: z.array(z.string()),
  before: z.record(z.string(), z.unknown()).nullable(),
  after: z.record(z.string(), z.unknown()).nullable(),
});

export type AuditEntryData = z.infer<typeof AuditEntrySchema>;

export const AuditListSchema = paginated(AuditEntrySchema);
export type AuditListData = z.infer<typeof AuditListSchema>;
