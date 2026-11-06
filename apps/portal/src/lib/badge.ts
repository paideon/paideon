import type { MyProfileData, StudentBadgeData } from '@paideon/contracts';

import { KIND_LABELS } from './kinds';

export type BadgeDetails = {
  fullName: string;
  kindLabel: string;
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
 * What goes on the ID badge (flat and 3D), chosen by the kind of person:
 * students show grade and admission number, staff show post and employee number.
 */
export function badgeDetails(profile: MyProfileData): BadgeDetails {
  const kindLabel = KIND_LABELS[profile.kind];

  let detailLabel = 'POST';
  let detailValue = clean(profile.designation) || kindLabel;
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
    kindLabel,
    detailLabel,
    detailValue,
    numberLabel,
    numberValue: numberValue || '—',
    paideonId: profile.paideonId,
    cardNumber: profile.cardNumber,
    initials: initialsOf(profile.firstName, profile.lastName),
  };
}

/** The same badge for a student, from the smaller record the People pages load. */
export function studentBadgeDetails(badge: StudentBadgeData): BadgeDetails {
  return {
    fullName: `${clean(badge.firstName)} ${clean(badge.lastName)}`.trim(),
    kindLabel: KIND_LABELS.STUDENT,
    detailLabel: 'GRADE',
    detailValue: `Grade ${badge.grade}${clean(badge.section) ? ` ${clean(badge.section)}` : ''}`,
    numberLabel: 'ADMISSION NO.',
    numberValue: clean(badge.admissionNumber) || '—',
    paideonId: badge.paideonId,
    cardNumber: badge.cardNumber,
    initials: initialsOf(badge.firstName, badge.lastName),
  };
}
