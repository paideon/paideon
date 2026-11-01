// A person's own fines, as returned by GET /api/library/me/fines.

import { z } from 'zod';

export const FINE_TYPE_VALUES = ['OVERDUE', 'DAMAGE', 'LOST_BOOK'] as const;
export const FINE_STATUS_VALUES = [
  'PENDING',
  'PAID',
  'WAIVED',
  'PARTIAL',
] as const;

export const FineTypeEnum = z.enum(FINE_TYPE_VALUES);
export const FineStatusEnum = z.enum(FINE_STATUS_VALUES);

export const FineSchema = z.object({
  id: z.string(),
  type: FineTypeEnum,
  status: FineStatusEnum,
  /** Rupees. The database stores a decimal; the API sends a number. */
  amountLKR: z.number().nonnegative(),
  amountPaidLKR: z.number().nonnegative(),
  daysOverdue: z.number().int().nonnegative().nullable(),
  createdAt: z.string(),
  paidAt: z.string().nullable(),
  bookTitle: z.string(),
});

export type FineData = z.infer<typeof FineSchema>;

export const MyFinesSchema = z.array(FineSchema);

export type MyFinesData = z.infer<typeof MyFinesSchema>;

/** What is still owed on a fine. Paid and waived fines owe nothing. */
export function fineBalance(
  fine: Pick<FineData, 'status' | 'amountLKR' | 'amountPaidLKR'>,
): number {
  if (fine.status === 'PAID' || fine.status === 'WAIVED') return 0;
  return Math.max(
    0,
    Math.round((fine.amountLKR - fine.amountPaidLKR) * 100) / 100,
  );
}
