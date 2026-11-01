import type { MyProfileData } from '@paideon/contracts';

import { ROLE_LABELS } from './roles';

export type BadgeDetails = {
  fullName: string;
  roleLabel: string;
  /** Caption and value of the "class" line: "GRADE / Grade 10 A", "POST / Librarian". */
  detailLabel: string;
  detailValue: string;
  /** Caption and value of the number line: "ADMISSION NO. / 4521", "STAFF NO. / T-102". */
  numberLabel: string;
  numberValue: string;
  paideonId: string;
  cardNumber: string;
  initials: string;
};

const clean = (text: string | null | undefined) => (text ?? '').trim();

export function initialsOf(firstName: string, lastName: string): string {
  const letters = [firstName, lastName]
    .map((name) => Array.from(clean(name))[0] ?? '')
    .join('');
  return letters.toUpperCase() || '?';
}

/**
 * What goes on the ID badge (flat and 3D), chosen by what the person IS:
 * students show grade and admission number, staff show post and employee number.
 */
export function badgeDetails(profile: MyProfileData): BadgeDetails {
  const roleLabel = ROLE_LABELS[profile.role];

  let detailLabel = 'POST';
  let detailValue = clean(profile.designation) || roleLabel;
  if (profile.grade !== null) {
    detailLabel = 'GRADE';
    detailValue = `Grade ${profile.grade}${
      clean(profile.section) ? ` ${clean(profile.section)}` : ''
    }`;
  }

  let numberLabel = 'STAFF NO.';
  let numberValue = clean(profile.employeeId);
  if (profile.admissionNumber) {
    numberLabel = 'ADMISSION NO.';
    numberValue = clean(profile.admissionNumber);
  }

  return {
    fullName: `${clean(profile.firstName)} ${clean(profile.lastName)}`.trim(),
    roleLabel,
    detailLabel,
    detailValue,
    numberLabel,
    numberValue: numberValue || '—',
    paideonId: profile.paideonId,
    cardNumber: profile.cardNumber,
    initials: initialsOf(profile.firstName, profile.lastName),
  };
}
