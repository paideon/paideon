// Turns database rows into the shapes in @paideon/contracts.

import type {
  StudentBadgeData,
  StudentData,
  StudentMissingEnumData,
  StudentSummaryData,
} from '@paideon/contracts';
import type { Prisma } from '@paideon/database/generated/client/client';
import type { MediaUrlService } from '../storage/media-url.service';

export const summarySelect = (currentYearId: string | null) =>
  ({
    id: true,
    paideonId: true,
    cardNumber: true,
    firstName: true,
    lastName: true,
    displayName: true,
    status: true,
    profileImageId: true,
    studentProfile: {
      select: {
        admissionNumber: true,
        currentGrade: true,
        currentSection: true,
        medium: true,
        gender: true,
        enrollmentStatus: true,
      },
    },
    classEnrollments: {
      where: currentYearId ? { academicYearId: currentYearId } : { id: '' },
      take: 1,
      select: {
        classId: true,
        class: { select: { grade: true, section: true } },
      },
    },
    emergencyContacts: {
      select: { phone: true },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    },
  }) satisfies Prisma.UserSelect;

export type SummaryRow = Prisma.UserGetPayload<{
  select: ReturnType<typeof summarySelect>;
}>;

export function toSummary(
  row: SummaryRow,
  options: { canSeeGuardianPhone: boolean; urls: MediaUrlService },
): StudentSummaryData {
  const profile = row.studentProfile;
  if (!profile) throw new Error(`Student ${row.id} has no student profile.`);
  const enrollment = row.classEnrollments[0] ?? null;
  const guardianPhone =
    row.emergencyContacts.find((contact) => contact.phone.trim() !== '')
      ?.phone ?? null;

  const missing: StudentMissingEnumData[] = [];
  if (!row.profileImageId) missing.push('PHOTO');
  if (guardianPhone === null) missing.push('GUARDIAN_PHONE');
  if (!enrollment) missing.push('CLASS');

  return {
    id: row.id,
    paideonId: row.paideonId,
    cardNumber: row.cardNumber,
    admissionNumber: profile.admissionNumber,
    firstName: row.firstName,
    lastName: row.lastName,
    displayName: row.displayName,
    photoUrl: options.urls.profilePhotoUrl(row.profileImageId, 'small'),
    grade: enrollment?.class.grade ?? profile.currentGrade,
    section: enrollment?.class.section ?? profile.currentSection,
    classId: enrollment?.classId ?? null,
    medium: profile.medium,
    gender: profile.gender,
    status: profile.enrollmentStatus,
    accountStatus: row.status,
    guardianPhone: options.canSeeGuardianPhone ? guardianPhone : null,
    missing,
  };
}

export const detailSelect = {
  id: true,
  paideonId: true,
  cardNumber: true,
  firstName: true,
  lastName: true,
  displayName: true,
  email: true,
  status: true,
  profileImageId: true,
  createdAt: true,
  updatedAt: true,
  studentProfile: {
    select: {
      admissionNumber: true,
      nameLocal: true,
      nameLocalLanguage: true,
      nameWithInitials: true,
      enrollmentStatus: true,
      dateOfBirth: true,
      gender: true,
      religion: true,
      ethnicity: true,
      medium: true,
      currentGrade: true,
      currentSection: true,
      admissionDate: true,
      gradeAtAdmission: true,
      homeAddressId: true,
      homeAddress: {
        select: { line1: true, line2: true, city: true, district: true },
      },
    },
  },
  classEnrollments: {
    orderBy: { enrolledAt: 'desc' },
    select: {
      id: true,
      classId: true,
      enrolledAt: true,
      status: true,
      transferNote: true,
      academicYear: { select: { label: true, isCurrent: true } },
      class: { select: { grade: true, section: true } },
    },
  },
  emergencyContacts: {
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      relationship: true,
      phone: true,
      isPrimary: true,
    },
  },
  studentStatusChanges: {
    orderBy: [{ effectiveDate: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      effectiveDate: true,
      reason: true,
      createdAt: true,
    },
  },
} satisfies Prisma.UserSelect;

export type DetailRow = Prisma.UserGetPayload<{ select: typeof detailSelect }>;

const dateOnly = (date: Date) => date.toISOString().slice(0, 10);

export function toStudent(
  row: DetailRow,
  options: {
    canSeeGuardianPhone: boolean;
    canSeeSensitive: boolean;
    urls: MediaUrlService;
  },
): StudentData {
  const profile = row.studentProfile;
  if (!profile) throw new Error(`Student ${row.id} has no student profile.`);
  const current =
    row.classEnrollments.find((e) => e.academicYear.isCurrent) ?? null;
  const guardianPhone =
    row.emergencyContacts.find((c) => c.phone.trim() !== '')?.phone ?? null;

  const missing: StudentMissingEnumData[] = [];
  if (!row.profileImageId) missing.push('PHOTO');
  if (guardianPhone === null) missing.push('GUARDIAN_PHONE');
  if (!current) missing.push('CLASS');

  return {
    id: row.id,
    paideonId: row.paideonId,
    cardNumber: row.cardNumber,
    admissionNumber: profile.admissionNumber,
    firstName: row.firstName,
    lastName: row.lastName,
    displayName: row.displayName,
    photoUrl: options.urls.profilePhotoUrl(row.profileImageId, 'large'),
    grade: current?.class.grade ?? profile.currentGrade,
    section: current?.class.section ?? profile.currentSection,
    classId: current?.classId ?? null,
    medium: profile.medium,
    gender: profile.gender,
    status: profile.enrollmentStatus,
    accountStatus: row.status,
    guardianPhone: options.canSeeGuardianPhone ? guardianPhone : null,
    missing,
    email: row.email,
    nameWithInitials: profile.nameWithInitials,
    nameLocal: profile.nameLocal,
    nameLocalLanguage: profile.nameLocalLanguage,
    dateOfBirth: dateOnly(profile.dateOfBirth),
    religion: options.canSeeSensitive ? profile.religion : null,
    ethnicity: options.canSeeSensitive ? profile.ethnicity : null,
    sensitiveVisible: options.canSeeSensitive,
    address: profile.homeAddress
      ? {
          line1: profile.homeAddress.line1,
          line2: profile.homeAddress.line2,
          city: profile.homeAddress.city,
          district: profile.homeAddress.district,
        }
      : null,
    admissionDate: dateOnly(profile.admissionDate),
    gradeAtAdmission: profile.gradeAtAdmission,
    guardians: row.emergencyContacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      relationship: contact.relationship,
      phone: options.canSeeGuardianPhone ? contact.phone : null,
      isPrimary: contact.isPrimary,
    })),
    classLabel: current
      ? `${current.class.grade}-${current.class.section}`
      : null,
    classHistory: row.classEnrollments.map((e) => ({
      id: e.id,
      academicYear: e.academicYear.label,
      grade: e.class.grade,
      section: e.class.section,
      enrolledAt: e.enrolledAt.toISOString(),
      status: e.status,
      note: e.transferNote,
      isCurrent: e.academicYear.isCurrent,
    })),
    statusHistory: row.studentStatusChanges.map((c) => ({
      id: c.id,
      fromStatus: c.fromStatus,
      toStatus: c.toStatus,
      effectiveDate: dateOnly(c.effectiveDate),
      reason: c.reason,
      createdAt: c.createdAt.toISOString(),
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toBadge(
  row: SummaryRow,
  urls: MediaUrlService,
): StudentBadgeData {
  const summary = toSummary(row, { canSeeGuardianPhone: false, urls });
  return {
    id: summary.id,
    paideonId: summary.paideonId,
    cardNumber: summary.cardNumber,
    admissionNumber: summary.admissionNumber,
    firstName: summary.firstName,
    lastName: summary.lastName,
    displayName: summary.displayName,
    photoUrl: urls.profilePhotoUrl(row.profileImageId, 'large'),
    grade: summary.grade,
    section: summary.section,
    status: summary.status,
  };
}
