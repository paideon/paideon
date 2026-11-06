import { Injectable } from '@nestjs/common';
import type {
  PersonKind,
  Prisma,
} from '@paideon/database/generated/client/client';

const KIND_CODES: Record<PersonKind, string> = {
  STUDENT: 'STU',
  TEACHER: 'TCH',
  PARENT: 'PAR',
  STAFF: 'STF',
};

const KIND_CARD_LETTERS: Record<PersonKind, string> = {
  STUDENT: 'S',
  TEACHER: 'T',
  PARENT: 'P',
  STAFF: 'F',
};

/** KCCM-STU-00001 */
export function formatPaideonId(
  schoolCode: string,
  kind: PersonKind,
  number: number,
): string {
  return `${schoolCode}-${KIND_CODES[kind]}-${String(number).padStart(5, '0')}`;
}

/**
 * KCCM-LIB-S00001. The letter keeps cards of different kinds apart: every
 * kind counts from 1, and card numbers must be unique across the school.
 */
export function formatCardNumber(
  schoolCode: string,
  kind: PersonKind,
  number: number,
): string {
  return `${schoolCode}-LIB-${KIND_CARD_LETTERS[kind]}${String(number).padStart(5, '0')}`;
}

@Injectable()
export class PaideonIdsService {
  /**
   * Takes the next number for this kind of person. Call inside the same
   * transaction that creates the person: the increment is one atomic
   * statement, so two people saved at once never get the same number, and a
   * failed save gives its number back.
   */
  async next(
    tx: Prisma.TransactionClient,
    schoolId: string,
    kind: PersonKind,
  ): Promise<{ paideonId: string; cardNumber: string }> {
    const school = await tx.school.findUniqueOrThrow({
      where: { id: schoolId },
      select: { schoolCode: true },
    });
    const sequence = await tx.paideonIdSequence.upsert({
      where: { schoolId_kind: { schoolId, kind } },
      create: { schoolId, kind, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return {
      paideonId: formatPaideonId(school.schoolCode, kind, sequence.lastNumber),
      cardNumber: formatCardNumber(
        school.schoolCode,
        kind,
        sequence.lastNumber,
      ),
    };
  }
}
