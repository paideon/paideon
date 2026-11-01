// A person's own loans, as returned by GET /api/library/me/loans.

import { z } from 'zod';

export const LOAN_STATUS_VALUES = [
  'ACTIVE',
  'OVERDUE',
  'RENEWED',
  'RETURNED',
  'LOST',
] as const;

export const LoanStatusEnum = z.enum(LOAN_STATUS_VALUES);

export type LoanStatusEnumData = z.infer<typeof LoanStatusEnum>;

// One row in a list of loans. Dates travel as ISO strings.
export const LoanSummarySchema = z.object({
  id: z.string(),
  checkoutDate: z.string(),
  dueDate: z.string(),
  returnDate: z.string().nullable(),
  status: LoanStatusEnum,
  renewalCount: z.number().int().nonnegative(),
  copy: z.object({
    code: z.string(),
    book: z.object({
      id: z.string(),
      title: z.string(),
      authors: z.array(z.string()),
    }),
  }),
});

export type LoanSummaryData = z.infer<typeof LoanSummarySchema>;

export const MyLoansSchema = z.array(LoanSummarySchema);

export type MyLoansData = z.infer<typeof MyLoansSchema>;

/** GET /api/library/me/loans?scope=... */
export const MY_LOANS_SCOPE_VALUES = ['current', 'history'] as const;
export type MyLoansScope = (typeof MY_LOANS_SCOPE_VALUES)[number];

/**
 * A loan is overdue when it is still out and its due date has passed. The
 * database status can still say ACTIVE for such a loan (nothing flips it at
 * midnight), so every screen asks this function instead of trusting status.
 */
export function isLoanOverdue(
  loan: Pick<LoanSummaryData, 'status' | 'dueDate' | 'returnDate'>,
  now: Date = new Date(),
): boolean {
  if (loan.returnDate !== null) return false;
  if (loan.status === 'RETURNED' || loan.status === 'LOST') return false;
  return new Date(loan.dueDate).getTime() < now.getTime();
}
