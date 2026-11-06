import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AssignClassData,
  AssignClassResultData,
  AuditListData,
  CapabilityGrantData,
  ChangeStudentStatusData,
  ChangeStudentStatusResultData,
  CreateStudentData,
  PaginatedData,
  StudentBadgeData,
  StudentData,
  StudentLibraryData,
  StudentListQueryData,
  StudentPhotoUploadData,
  StudentSummaryData,
  UpdateStudentData,
} from '@paideon/contracts';
import { Prisma, UserStatus } from '@paideon/database/generated/client/client';
import { AuditService } from '../audit/audit.service';
import { holdsSchoolWide, reachFor, reachIncludes } from '../access/scope';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';
import { MediaUrlService } from '../storage/media-url.service';
import { PhotoService } from '../storage/photo.service';
import { csvCell } from './csv';
import { LibraryService } from '../library/library.service';
import { PaideonIdsService } from './paideon-ids.service';
import {
  detailSelect,
  summarySelect,
  toBadge,
  toStudent,
  toSummary,
} from './student-mapper';
import { studentScopeWhere, unionReach } from './student-scope';

export type RequestContext = { ipAddress?: string; userAgent?: string };

const MAX_EXPORT_ROWS = 5000;
const SENSITIVE_KEYS = ['religion', 'ethnicity'];

function fieldError(
  Exception: typeof ConflictException | typeof BadRequestException,
  field: string,
  message: string,
  code: string,
) {
  return new Exception({
    statusCode: Exception === ConflictException ? 409 : 400,
    message: [message],
    code,
    fieldErrors: { [field]: message },
  });
}

const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly ids: PaideonIdsService,
    private readonly urls: MediaUrlService,
    private readonly photos: PhotoService,
    private readonly library: LibraryService,
  ) {}

  // ───────────────────────── helpers ─────────────────────────

  private async currentYearId(schoolId: string): Promise<string | null> {
    const year = await this.prisma.academicYear.findFirst({
      where: { schoolId, isCurrent: true },
      select: { id: true },
    });
    return year?.id ?? null;
  }

  /** The people.read filter for this person, as a database condition. */
  private async readWhere(
    schoolId: string,
    grants: CapabilityGrantData[],
    extraCapabilities: Array<'library.members.read'> = [],
  ): Promise<{ where: Prisma.UserWhereInput; yearId: string | null }> {
    let reach = reachFor(grants, 'people.read');
    for (const capability of extraCapabilities) {
      reach = unionReach(reach, reachFor(grants, capability));
    }
    const yearId = await this.currentYearId(schoolId);
    return {
      where: {
        schoolId,
        kind: 'STUDENT',
        deletedAt: null,
        AND: [studentScopeWhere(reach, yearId)],
      },
      yearId,
    };
  }

  /** Loads one student the person may read, or 404 (never 403: do not reveal who exists). */
  private async loadForRead(
    id: string,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
  ) {
    const { where } = await this.readWhere(actor.schoolId, grants);
    const row = await this.prisma.user.findFirst({
      where: { AND: [where, { id }] },
      select: detailSelect,
    });
    if (!row?.studentProfile) throw new NotFoundException('Student not found.');
    return row;
  }

  /** Throws unless people.write reaches this student. */
  private async assertCanWrite(
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    student: { grade: number; classId: string | null },
  ) {
    const reach = reachFor(grants, 'people.write');
    if (
      !reachIncludes(reach, { grade: student.grade, classId: student.classId })
    ) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'You do not have access to change this student.',
        code: 'MISSING_CAPABILITY',
      });
    }
  }

  private record(
    actor: JwtPayload,
    context: RequestContext,
    tx: Prisma.TransactionClient,
    entry: {
      action: string;
      entityId: string;
      oldValues?: Prisma.InputJsonValue;
      newValues?: Prisma.InputJsonValue;
    },
  ) {
    return this.audit.record(
      {
        schoolId: actor.schoolId,
        actorUserId: actor.sub,
        actorRole: actor.kind,
        actorPaideonId: actor.paideonId,
        entityType: 'User',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        ...entry,
      },
      tx,
    );
  }

  // ───────────────────────── list ─────────────────────────

  private listFilters(
    query: StudentListQueryData,
    yearId: string | null,
  ): Prisma.UserWhereInput[] {
    const filters: Prisma.UserWhereInput[] = [];

    const profile: Prisma.StudentProfileWhereInput = {};
    if (query.status !== 'ALL') profile.enrollmentStatus = query.status;
    if (query.grade !== undefined) profile.currentGrade = query.grade;
    if (query.medium) profile.medium = query.medium;
    if (query.gender) profile.gender = query.gender;
    if (Object.keys(profile).length > 0) {
      filters.push({ studentProfile: { is: profile } });
    }

    if (query.classId) {
      filters.push({
        classEnrollments: {
          some: {
            classId: query.classId,
            ...(yearId ? { academicYearId: yearId } : {}),
          },
        },
      });
    }
    if (query.missingPhoto) filters.push({ profileImageId: null });
    if (query.missingGuardianPhone) {
      filters.push({ emergencyContacts: { none: { phone: { not: '' } } } });
    }
    if (query.ids && query.ids.length > 0)
      filters.push({ id: { in: query.ids } });

    // Every word must match somewhere: "nimal 10" finds Nimal in grade 10 only if
    // some field holds each word.
    for (const term of (query.q ?? '').split(/\s+/).filter(Boolean)) {
      filters.push({
        OR: [
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
          { displayName: { contains: term, mode: 'insensitive' } },
          { paideonId: { contains: term, mode: 'insensitive' } },
          { cardNumber: { contains: term, mode: 'insensitive' } },
          {
            studentProfile: {
              is: {
                OR: [
                  { admissionNumber: { contains: term, mode: 'insensitive' } },
                  { nameLocal: { contains: term } },
                  { nameWithInitials: { contains: term, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      });
    }
    return filters;
  }

  private orderBy(
    query: StudentListQueryData,
  ): Prisma.UserOrderByWithRelationInput[] {
    const dir = query.dir;
    switch (query.sort) {
      case 'admissionNumber':
        return [{ studentProfile: { admissionNumber: dir } }, { id: 'asc' }];
      case 'class':
        return [
          { studentProfile: { currentGrade: dir } },
          { studentProfile: { currentSection: dir } },
          { lastName: 'asc' },
          { id: 'asc' },
        ];
      default:
        return [{ lastName: dir }, { firstName: dir }, { id: 'asc' }];
    }
  }

  async list(
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    query: StudentListQueryData,
  ): Promise<PaginatedData<StudentSummaryData>> {
    const { where, yearId } = await this.readWhere(actor.schoolId, grants);
    const full: Prisma.UserWhereInput = {
      AND: [where, ...this.listFilters(query, yearId)],
    };
    const canSeeGuardianPhone = holdsSchoolWide(grants, 'people.read');

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count({ where: full }),
      this.prisma.user.findMany({
        where: full,
        orderBy: this.orderBy(query),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        select: summarySelect(yearId),
      }),
    ]);

    return {
      items: rows.map((row) =>
        toSummary(row, { canSeeGuardianPhone, urls: this.urls }),
      ),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  // ───────────────────────── CSV export ─────────────────────────

  async exportCsv(
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    query: StudentListQueryData,
  ): Promise<string> {
    const { where, yearId } = await this.readWhere(actor.schoolId, grants);
    const rows = await this.prisma.user.findMany({
      where: { AND: [where, ...this.listFilters(query, yearId)] },
      orderBy: this.orderBy(query),
      take: MAX_EXPORT_ROWS,
      select: summarySelect(yearId),
    });
    const canSeeGuardianPhone = holdsSchoolWide(grants, 'people.read');

    const header = [
      'Paideon ID',
      'Admission number',
      'First name',
      'Last name',
      'Grade',
      'Section',
      'Medium',
      'Gender',
      'Status',
      'Guardian phone',
    ];
    const lines = [header.map(csvCell).join(',')];
    for (const row of rows) {
      const s = toSummary(row, { canSeeGuardianPhone, urls: this.urls });
      lines.push(
        [
          s.paideonId,
          s.admissionNumber,
          s.firstName,
          s.lastName,
          String(s.grade),
          s.section ?? '',
          s.medium,
          s.gender,
          s.status,
          s.guardianPhone ?? '',
        ]
          .map(csvCell)
          .join(','),
      );
    }
    // The byte-order mark lets Excel open Sinhala and Tamil text correctly.
    return `﻿${lines.join('\r\n')}\r\n`;
  }

  // ───────────────────────── one student ─────────────────────────

  async get(
    id: string,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
  ): Promise<StudentData> {
    const row = await this.loadForRead(id, actor, grants);
    const profile = row.studentProfile!;
    const sensitiveReach = reachFor(grants, 'people.sensitive.read');
    const enrollment = row.classEnrollments.find(
      (e) => e.academicYear.isCurrent,
    );
    return toStudent(row, {
      canSeeGuardianPhone: holdsSchoolWide(grants, 'people.read'),
      canSeeSensitive: reachIncludes(sensitiveReach, {
        grade: profile.currentGrade,
        classId: enrollment?.classId ?? null,
      }),
      urls: this.urls,
    });
  }

  /** The smaller record a badge needs. Librarians may print badges without people.read. */
  async badges(
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    ids: string[],
  ): Promise<StudentBadgeData[]> {
    const { where, yearId } = await this.readWhere(actor.schoolId, grants, [
      'library.members.read',
    ]);
    const rows = await this.prisma.user.findMany({
      where: { AND: [where, { id: { in: ids } }] },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: summarySelect(yearId),
    });
    return rows.map((row) => toBadge(row, this.urls));
  }

  /** Reprinting is audited: a lost-card replacement may carry a fee later. */
  async recordBadgePrint(
    ids: string[],
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ) {
    const found = await this.badges(actor, grants, ids);
    if (found.length === 0) throw new NotFoundException('Student not found.');
    await this.prisma.$transaction(async (tx) => {
      for (const badge of found) {
        await this.record(actor, context, tx, {
          action: 'people.student.badge.print',
          entityId: badge.id,
          newValues: { cardNumber: badge.cardNumber },
        });
      }
    });
    return found.length;
  }

  // ───────────────────────── create ─────────────────────────

  /** Checks the class belongs to this school's current year and matches the grade. */
  private async resolveClass(
    tx: Prisma.TransactionClient,
    schoolId: string,
    classId: string,
    grade: number,
  ) {
    const found = await tx.class.findFirst({
      where: { id: classId, schoolId, academicYear: { isCurrent: true } },
      select: { id: true, grade: true, section: true, academicYearId: true },
    });
    if (!found) {
      throw fieldError(
        BadRequestException,
        'classId',
        'Choose a class from this year.',
        'CLASS_NOT_FOUND',
      );
    }
    if (found.grade !== grade) {
      throw fieldError(
        BadRequestException,
        'classId',
        `That class is in Grade ${found.grade}, not Grade ${grade}.`,
        'CLASS_GRADE_MISMATCH',
      );
    }
    return found;
  }

  async create(
    dto: CreateStudentData,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ): Promise<{ id: string; paideonId: string }> {
    // Adding a student is a school-wide act: the new record has no scope yet.
    if (!holdsSchoolWide(grants, 'people.write')) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'You do not have access to add students.',
        code: 'MISSING_CAPABILITY',
      });
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const [sameAdmission, sameEmail] = await Promise.all([
          tx.studentProfile.findFirst({
            where: {
              schoolId: actor.schoolId,
              admissionNumber: dto.admissionNumber,
            },
            select: { id: true },
          }),
          tx.user.findFirst({
            where: { schoolId: actor.schoolId, email: dto.email },
            select: { id: true },
          }),
        ]);
        if (sameAdmission) {
          throw fieldError(
            ConflictException,
            'admissionNumber',
            'This admission number is already used.',
            'ADMISSION_NUMBER_TAKEN',
          );
        }
        if (sameEmail) {
          throw fieldError(
            ConflictException,
            'email',
            'This email is already used by another account.',
            'EMAIL_TAKEN',
          );
        }

        const klass = dto.classId
          ? await this.resolveClass(
              tx,
              actor.schoolId,
              dto.classId,
              dto.currentGrade,
            )
          : null;

        const address = await tx.address.create({
          data: {
            line1: dto.address.line1,
            line2: dto.address.line2,
            city: dto.address.city,
            district: dto.address.district,
          },
        });
        const { paideonId, cardNumber } = await this.ids.next(
          tx,
          actor.schoolId,
          'STUDENT',
        );

        const user = await tx.user.create({
          data: {
            schoolId: actor.schoolId,
            paideonId,
            cardNumber,
            email: dto.email,
            kind: 'STUDENT',
            status: UserStatus.PENDING,
            firstName: dto.firstName,
            lastName: dto.lastName,
            studentProfile: {
              create: {
                schoolId: actor.schoolId,
                admissionNumber: dto.admissionNumber,
                nameLocal: dto.nameLocal,
                nameLocalLanguage: dto.nameLocalLanguage,
                nameWithInitials: dto.nameWithInitials,
                dateOfBirth: toDate(dto.dateOfBirth),
                gender: dto.gender,
                religion: dto.religion,
                ethnicity: dto.ethnicity,
                medium: dto.medium,
                homeAddressId: address.id,
                currentGrade: dto.currentGrade,
                currentSection: klass?.section ?? null,
                admissionDate: toDate(dto.admissionDate),
                gradeAtAdmission: dto.gradeAtAdmission,
              },
            },
            emergencyContacts: {
              create: dto.guardians.map((guardian, index) => ({
                schoolId: actor.schoolId,
                name: guardian.name,
                relationship: guardian.relationship,
                phone: guardian.phone,
                isPrimary: index === 0,
              })),
            },
          },
          select: { id: true, paideonId: true },
        });

        if (klass) {
          await tx.classEnrollment.create({
            data: {
              schoolId: actor.schoolId,
              classId: klass.id,
              studentUserId: user.id,
              academicYearId: klass.academicYearId,
            },
          });
        }

        await this.record(actor, context, tx, {
          action: 'people.student.create',
          entityId: user.id,
          newValues: {
            paideonId,
            admissionNumber: dto.admissionNumber,
            firstName: dto.firstName,
            lastName: dto.lastName,
            currentGrade: dto.currentGrade,
            classId: dto.classId,
            medium: dto.medium,
          },
        });
        return user;
      });
    } catch (error) {
      throw this.mapUniqueViolation(error);
    }
  }

  /** Two saves at the same moment can both pass the pre-check; the database has the last word. */
  private mapUniqueViolation(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = String(error.meta?.target ?? '');
      if (target.includes('admissionNumber')) {
        return fieldError(
          ConflictException,
          'admissionNumber',
          'This admission number is already used.',
          'ADMISSION_NUMBER_TAKEN',
        );
      }
      if (target.includes('email')) {
        return fieldError(
          ConflictException,
          'email',
          'This email is already used by another account.',
          'EMAIL_TAKEN',
        );
      }
    }
    return error;
  }

  // ───────────────────────── update ─────────────────────────

  async update(
    id: string,
    dto: UpdateStudentData,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ): Promise<{ id: string }> {
    const existing = await this.loadForRead(id, actor, grants);
    const profile = existing.studentProfile!;
    const currentEnrollment = existing.classEnrollments.find(
      (e) => e.academicYear.isCurrent,
    );
    await this.assertCanWrite(actor, grants, {
      grade: profile.currentGrade,
      classId: currentEnrollment?.classId ?? null,
    });

    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};
    const track = (key: string, oldValue: unknown, newValue: unknown) => {
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return false;
      before[key] = oldValue ?? null;
      after[key] = newValue ?? null;
      return true;
    };
    const dateText = (d: Date) => d.toISOString().slice(0, 10);

    try {
      await this.prisma.$transaction(async (tx) => {
        const userData: Prisma.UserUpdateInput = {};
        const profileData: Prisma.StudentProfileUpdateInput = {};

        if (
          dto.firstName !== undefined &&
          track('firstName', existing.firstName, dto.firstName)
        ) {
          userData.firstName = dto.firstName;
        }
        if (
          dto.lastName !== undefined &&
          track('lastName', existing.lastName, dto.lastName)
        ) {
          userData.lastName = dto.lastName;
        }

        const simple = [
          ['nameWithInitials', profile.nameWithInitials, dto.nameWithInitials],
          ['nameLocal', profile.nameLocal, dto.nameLocal],
          [
            'nameLocalLanguage',
            profile.nameLocalLanguage,
            dto.nameLocalLanguage,
          ],
          ['gender', profile.gender, dto.gender],
          ['religion', profile.religion, dto.religion],
          ['ethnicity', profile.ethnicity, dto.ethnicity],
          ['medium', profile.medium, dto.medium],
          ['gradeAtAdmission', profile.gradeAtAdmission, dto.gradeAtAdmission],
        ] as const;
        for (const [key, oldValue, newValue] of simple) {
          if (newValue !== undefined && track(key, oldValue, newValue)) {
            (profileData as Record<string, unknown>)[key] = newValue;
          }
        }
        if (
          dto.dateOfBirth !== undefined &&
          track('dateOfBirth', dateText(profile.dateOfBirth), dto.dateOfBirth)
        ) {
          profileData.dateOfBirth = toDate(dto.dateOfBirth);
        }
        if (
          dto.admissionDate !== undefined &&
          track(
            'admissionDate',
            dateText(profile.admissionDate),
            dto.admissionDate,
          )
        ) {
          profileData.admissionDate = toDate(dto.admissionDate);
        }
        if (
          dto.admissionNumber !== undefined &&
          dto.admissionNumber !== profile.admissionNumber
        ) {
          const clash = await tx.studentProfile.findFirst({
            where: {
              schoolId: actor.schoolId,
              admissionNumber: dto.admissionNumber,
              NOT: { userId: id },
            },
            select: { id: true },
          });
          if (clash) {
            throw fieldError(
              ConflictException,
              'admissionNumber',
              'This admission number is already used.',
              'ADMISSION_NUMBER_TAKEN',
            );
          }
          track(
            'admissionNumber',
            profile.admissionNumber,
            dto.admissionNumber,
          );
          profileData.admissionNumber = dto.admissionNumber;
        }

        // Grade and class. The class must belong to this year and match the grade.
        const newGrade = dto.currentGrade ?? profile.currentGrade;
        const gradeChanged =
          dto.currentGrade !== undefined &&
          dto.currentGrade !== profile.currentGrade;
        let newClassId = currentEnrollment?.classId ?? null;
        if (dto.classId !== undefined) {
          if (dto.classId === null && currentEnrollment) {
            throw fieldError(
              BadRequestException,
              'classId',
              'Choose the class this student is in.',
              'CLASS_REQUIRED',
            );
          }
          newClassId = dto.classId;
        } else if (
          gradeChanged &&
          currentEnrollment &&
          currentEnrollment.class.grade !== newGrade
        ) {
          throw fieldError(
            BadRequestException,
            'classId',
            `Choose a class in Grade ${newGrade}.`,
            'CLASS_REQUIRED',
          );
        }
        let newSection = profile.currentSection;
        if (newClassId && newClassId !== (currentEnrollment?.classId ?? null)) {
          const klass = await this.resolveClass(
            tx,
            actor.schoolId,
            newClassId,
            newGrade,
          );
          newSection = klass.section;
          const from = currentEnrollment
            ? `${currentEnrollment.class.grade}-${currentEnrollment.class.section}`
            : null;
          if (currentEnrollment) {
            await tx.classEnrollment.update({
              where: { id: currentEnrollment.id },
              data: {
                classId: klass.id,
                transferNote: `Moved from ${from} on ${new Date().toISOString().slice(0, 10)}`,
              },
            });
          } else {
            await tx.classEnrollment.create({
              data: {
                schoolId: actor.schoolId,
                classId: klass.id,
                studentUserId: id,
                academicYearId: klass.academicYearId,
              },
            });
          }
          track('class', from, `${klass.grade}-${klass.section}`);
        }
        if (track('currentGrade', profile.currentGrade, newGrade)) {
          profileData.currentGrade = newGrade;
        }
        if (newSection !== profile.currentSection)
          profileData.currentSection = newSection;

        // Address
        if (dto.address) {
          const old = profile.homeAddress;
          const next = dto.address;
          const changed = track(
            'address',
            old
              ? {
                  line1: old.line1,
                  line2: old.line2,
                  city: old.city,
                  district: old.district,
                }
              : null,
            {
              line1: next.line1,
              line2: next.line2,
              city: next.city,
              district: next.district,
            },
          );
          if (changed) {
            if (profile.homeAddressId) {
              await tx.address.update({
                where: { id: profile.homeAddressId },
                data: {
                  line1: next.line1,
                  line2: next.line2,
                  city: next.city,
                  district: next.district,
                },
              });
            } else {
              const created = await tx.address.create({
                data: {
                  line1: next.line1,
                  line2: next.line2,
                  city: next.city,
                  district: next.district,
                },
              });
              profileData.homeAddress = { connect: { id: created.id } };
            }
          }
        }

        // Guardians are replaced as a set.
        if (dto.guardians) {
          const oldGuardians = existing.emergencyContacts.map((c) => ({
            name: c.name,
            relationship: c.relationship,
            phone: c.phone,
          }));
          const newGuardians = dto.guardians.map((g) => ({
            name: g.name,
            relationship: g.relationship,
            phone: g.phone,
          }));
          if (track('guardians', oldGuardians, newGuardians)) {
            await tx.emergencyContact.deleteMany({ where: { userId: id } });
            await tx.emergencyContact.createMany({
              data: dto.guardians.map((g, index) => ({
                userId: id,
                schoolId: actor.schoolId,
                name: g.name,
                relationship: g.relationship,
                phone: g.phone,
                isPrimary: index === 0,
              })),
            });
          }
        }

        if (Object.keys(before).length === 0) return;

        if (Object.keys(userData).length > 0) {
          await tx.user.update({ where: { id }, data: userData });
        }
        if (Object.keys(profileData).length > 0) {
          await tx.studentProfile.update({
            where: { userId: id },
            data: profileData,
          });
        }
        await this.record(actor, context, tx, {
          action: 'people.student.update',
          entityId: id,
          oldValues: before as Prisma.InputJsonValue,
          newValues: after as Prisma.InputJsonValue,
        });
      });
    } catch (error) {
      throw this.mapUniqueViolation(error);
    }
    return { id };
  }

  // ───────────────────────── status ─────────────────────────

  async changeStatus(
    id: string,
    dto: ChangeStudentStatusData,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ): Promise<ChangeStudentStatusResultData> {
    const existing = await this.loadForRead(id, actor, grants);
    const profile = existing.studentProfile!;
    const current = existing.classEnrollments.find(
      (e) => e.academicYear.isCurrent,
    );
    await this.assertCanWrite(actor, grants, {
      grade: profile.currentGrade,
      classId: current?.classId ?? null,
    });

    if (dto.status === profile.enrollmentStatus) {
      throw fieldError(
        BadRequestException,
        'status',
        'The student already has this status.',
        'STATUS_UNCHANGED',
      );
    }
    if (dto.effectiveDate > new Date().toISOString().slice(0, 10)) {
      throw fieldError(
        BadRequestException,
        'effectiveDate',
        'The date cannot be in the future.',
        'DATE_IN_FUTURE',
      );
    }

    // Only ACTIVE students can sign in or borrow books. Coming back restores
    // the account to what it was: active if the password was ever set, else
    // waiting for activation.
    const hasPassword = (
      await this.prisma.user.findUnique({
        where: { id },
        select: { password: true },
      })
    )?.password;
    const accountStatus =
      dto.status === 'ACTIVE'
        ? hasPassword
          ? UserStatus.ACTIVE
          : UserStatus.PENDING
        : dto.status === 'GRADUATED'
          ? UserStatus.GRADUATED
          : UserStatus.INACTIVE;

    await this.prisma.$transaction(async (tx) => {
      await tx.studentProfile.update({
        where: { userId: id },
        data: { enrollmentStatus: dto.status },
      });
      await tx.user.update({ where: { id }, data: { status: accountStatus } });
      if (dto.status !== 'ACTIVE') {
        await tx.refreshToken.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      await tx.studentStatusChange.create({
        data: {
          schoolId: actor.schoolId,
          studentUserId: id,
          fromStatus: profile.enrollmentStatus,
          toStatus: dto.status,
          effectiveDate: toDate(dto.effectiveDate),
          reason: dto.reason,
          changedBy: actor.sub,
        },
      });
      await this.record(actor, context, tx, {
        action: 'people.student.status',
        entityId: id,
        oldValues: { status: profile.enrollmentStatus },
        newValues: {
          status: dto.status,
          effectiveDate: dto.effectiveDate,
          reason: dto.reason,
        },
      });
    });

    const activeLoans = await this.prisma.loan.count({
      where: {
        schoolId: actor.schoolId,
        userId: id,
        status: { in: ['ACTIVE', 'OVERDUE'] },
      },
    });
    return { status: dto.status, activeLoans };
  }

  // ───────────────────────── photo ─────────────────────────

  async setPhoto(
    id: string,
    file: Buffer,
    crop: StudentPhotoUploadData,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ): Promise<{ photoUrl: string }> {
    const existing = await this.loadForRead(id, actor, grants);
    const profile = existing.studentProfile!;
    const current = existing.classEnrollments.find(
      (e) => e.academicYear.isCurrent,
    );
    await this.assertCanWrite(actor, grants, {
      grade: profile.currentGrade,
      classId: current?.classId ?? null,
    });

    const media = await this.photos.saveProfilePhoto({
      schoolId: actor.schoolId,
      ownerUserId: id,
      uploadedBy: actor.sub,
      data: file,
      crop,
    });
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: { profileImageId: media.id },
      });
      await this.record(actor, context, tx, {
        action: 'people.student.photo',
        entityId: id,
        oldValues: { hadPhoto: existing.profileImageId !== null },
        newValues: { hadPhoto: true },
      });
    });
    // After the swap, so a failed save never leaves a student with no photo.
    await this.photos.discard(existing.profileImageId);

    return { photoUrl: this.urls.profilePhotoUrl(media.id, 'large')! };
  }

  // ───────────────────────── assign class ─────────────────────────

  async assignClass(
    dto: AssignClassData,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    context: RequestContext,
  ): Promise<AssignClassResultData> {
    const klass = await this.prisma.class.findFirst({
      where: {
        id: dto.classId,
        schoolId: actor.schoolId,
        academicYear: { isCurrent: true },
      },
      select: { id: true, grade: true, section: true, academicYearId: true },
    });
    if (!klass)
      throw fieldError(
        BadRequestException,
        'classId',
        'Choose a class from this year.',
        'CLASS_NOT_FOUND',
      );

    const { where } = await this.readWhere(actor.schoolId, grants);
    const students = await this.prisma.user.findMany({
      where: { AND: [where, { id: { in: dto.studentIds } }] },
      select: {
        id: true,
        studentProfile: { select: { currentGrade: true } },
        classEnrollments: {
          where: { academicYearId: klass.academicYearId },
          select: {
            id: true,
            classId: true,
            class: { select: { grade: true, section: true } },
          },
        },
      },
    });
    const writeReach = reachFor(grants, 'people.write');
    const found = new Set(students.map((s) => s.id));
    const skipped: AssignClassResultData['skipped'] = dto.studentIds
      .filter((id) => !found.has(id))
      .map((id) => ({ id, reason: 'Student not found.' }));
    let assigned = 0;

    for (const student of students) {
      const enrollment = student.classEnrollments[0] ?? null;
      const grade = student.studentProfile?.currentGrade ?? 0;
      if (
        !reachIncludes(writeReach, {
          grade,
          classId: enrollment?.classId ?? null,
        })
      ) {
        skipped.push({
          id: student.id,
          reason: 'You cannot change this student.',
        });
        continue;
      }
      if (grade !== klass.grade) {
        skipped.push({
          id: student.id,
          reason: `Student is in Grade ${grade}, the class is Grade ${klass.grade}.`,
        });
        continue;
      }
      if (enrollment?.classId === klass.id) {
        skipped.push({ id: student.id, reason: 'Already in this class.' });
        continue;
      }
      await this.prisma.$transaction(async (tx) => {
        const from = enrollment
          ? `${enrollment.class.grade}-${enrollment.class.section}`
          : null;
        if (enrollment) {
          await tx.classEnrollment.update({
            where: { id: enrollment.id },
            data: {
              classId: klass.id,
              transferNote: `Moved from ${from} on ${new Date().toISOString().slice(0, 10)}`,
            },
          });
        } else {
          await tx.classEnrollment.create({
            data: {
              schoolId: actor.schoolId,
              classId: klass.id,
              studentUserId: student.id,
              academicYearId: klass.academicYearId,
            },
          });
        }
        await tx.studentProfile.update({
          where: { userId: student.id },
          data: { currentSection: klass.section },
        });
        await this.record(actor, context, tx, {
          action: 'people.student.update',
          entityId: student.id,
          oldValues: { class: from },
          newValues: { class: `${klass.grade}-${klass.section}` },
        });
      });
      assigned += 1;
    }
    return { assigned, skipped };
  }

  // ───────────────────────── library ─────────────────────────

  /** A student's books out, recent returns and fines, for the Library tab. */
  async libraryRecord(
    id: string,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
  ): Promise<StudentLibraryData> {
    await this.loadForRead(id, actor, grants);
    const [current, history, fines] = await Promise.all([
      this.library.myLoans(actor.schoolId, id, 'current'),
      this.library.myLoans(actor.schoolId, id, 'history'),
      this.library.myFines(actor.schoolId, id),
    ]);
    return { current, history: history.slice(0, 20), fines };
  }

  // ───────────────────────── activity ─────────────────────────

  async activity(
    id: string,
    actor: JwtPayload,
    grants: CapabilityGrantData[],
    page: number,
    pageSize: number,
  ): Promise<AuditListData> {
    const row = await this.loadForRead(id, actor, grants);
    const profile = row.studentProfile!;
    const enrollment = row.classEnrollments.find(
      (e) => e.academicYear.isCurrent,
    );
    const canSeeSensitive = reachIncludes(
      reachFor(grants, 'people.sensitive.read'),
      {
        grade: profile.currentGrade,
        classId: enrollment?.classId ?? null,
      },
    );
    const where: Prisma.AuditLogWhereInput = {
      schoolId: actor.schoolId,
      entityType: 'User',
      entityId: id,
      action: { startsWith: 'people.' },
    };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const asRecord = (
      value: Prisma.JsonValue | null,
    ): Record<string, unknown> | null =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? { ...(value as Record<string, unknown>) }
        : null;
    const actorIds = [
      ...new Set(
        rows.map((r) => r.actorUserId).filter((v): v is string => !!v),
      ),
    ];
    const actors = await this.prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, firstName: true, lastName: true },
    });
    const names = new Map(
      actors.map((a) => [a.id, `${a.firstName} ${a.lastName}`]),
    );

    return {
      items: rows.map((entry) => {
        const before = asRecord(entry.oldValues);
        const after = asRecord(entry.newValues);
        if (!canSeeSensitive) {
          for (const key of SENSITIVE_KEYS) {
            if (before) delete before[key];
            if (after) delete after[key];
          }
        }
        return {
          id: entry.id,
          action: entry.action,
          actor: {
            paideonId: entry.actorPaideonId,
            name: entry.actorUserId
              ? (names.get(entry.actorUserId) ?? null)
              : null,
          },
          createdAt: entry.createdAt.toISOString(),
          changedFields: after ? Object.keys(after) : [],
          before,
          after,
        };
      }),
      total,
      page,
      pageSize,
    };
  }
}
