import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@paideon/database/generated/client/client';
import type { MyProfileData, UpdateMyContactData } from '@paideon/contracts';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';

const addressSelect = { select: { id: true, line1: true } } as const;

// Everything on a person's own record is read through here, and only ever
// for the person in the access token: there is no id parameter to tamper with.
@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private async load(userId: string, schoolId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, schoolId, deletedAt: null },
      select: {
        id: true,
        paideonId: true,
        cardNumber: true,
        role: true,
        firstName: true,
        lastName: true,
        displayName: true,
        email: true,
        phone: true,
        studentProfile: {
          select: {
            admissionNumber: true,
            currentGrade: true,
            currentSection: true,
            homeAddress: addressSelect,
          },
        },
        teacherProfile: {
          select: {
            employeeId: true,
            designation: true,
            homeAddress: addressSelect,
          },
        },
        staffProfile: {
          select: {
            employeeId: true,
            designation: true,
            homeAddress: addressSelect,
          },
        },
        parentProfile: { select: { homeAddress: addressSelect } },
      },
    });
    if (!user) throw new NotFoundException('Account not found.');
    return user;
  }

  async profile(actor: JwtPayload): Promise<MyProfileData> {
    const user = await this.load(actor.sub, actor.schoolId);
    const student = user.studentProfile;
    const teacher = user.teacherProfile;
    const staff = user.staffProfile;
    const parent = user.parentProfile;

    const hasProfile = Boolean(student || teacher || staff || parent);
    const homeAddress =
      student?.homeAddress ??
      teacher?.homeAddress ??
      staff?.homeAddress ??
      parent?.homeAddress ??
      null;

    return {
      id: user.id,
      paideonId: user.paideonId,
      cardNumber: user.cardNumber,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      photoUrl: null, // no photo storage yet
      phone: user.phone,
      address: homeAddress?.line1 ?? null,
      addressEditable: hasProfile,
      grade: student?.currentGrade ?? null,
      section: student?.currentSection ?? null,
      admissionNumber: student?.admissionNumber ?? null,
      employeeId: teacher?.employeeId ?? staff?.employeeId ?? null,
      designation: teacher?.designation ?? staff?.designation ?? null,
    };
  }

  async updateContact(
    actor: JwtPayload,
    dto: UpdateMyContactData,
    context: { ipAddress?: string; userAgent?: string },
  ): Promise<MyProfileData> {
    const before = await this.profile(actor);

    // An address needs a profile row to hang off. Refuse silently-dropped edits.
    const wantsAddressChange = dto.address !== before.address;
    if (wantsAddressChange && !before.addressEditable) {
      throw new BadRequestException(
        'Your account has no address on file to change. Ask the school office.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.phone !== before.phone) {
        await tx.user.update({
          where: { id: actor.sub },
          data: { phone: dto.phone },
        });
      }

      if (wantsAddressChange) {
        await this.saveAddress(tx, actor.sub, dto.address);
      }

      await this.audit.record(
        {
          schoolId: actor.schoolId,
          actorUserId: actor.sub,
          actorRole: actor.role,
          actorPaideonId: actor.paideonId,
          action: 'me.contact.update',
          entityType: 'User',
          entityId: actor.sub,
          oldValues: { phone: before.phone, address: before.address },
          newValues: { phone: dto.phone, address: dto.address },
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        },
        tx,
      );
    });

    return this.profile(actor);
  }

  // Updates line1 of the existing home address, or creates one and links it
  // from whichever profile the person has. Clearing the field unlinks the
  // address; the old Address row stays for the office's records.
  private async saveAddress(
    tx: Prisma.TransactionClient,
    userId: string,
    line1: string | null,
  ) {
    const profiles = await Promise.all([
      tx.studentProfile.findUnique({
        where: { userId },
        select: { id: true, homeAddressId: true },
      }),
      tx.teacherProfile.findUnique({
        where: { userId },
        select: { id: true, homeAddressId: true },
      }),
      tx.staffProfile.findUnique({
        where: { userId },
        select: { id: true, homeAddressId: true },
      }),
      tx.parentProfile.findUnique({
        where: { userId },
        select: { id: true, homeAddressId: true },
      }),
    ]);
    const kinds = ['student', 'teacher', 'staff', 'parent'] as const;
    const index = profiles.findIndex((profile) => profile !== null);
    const profile = profiles[index];
    if (!profile) return;
    const kind = kinds[index];

    let addressId = profile.homeAddressId;
    if (line1 === null) {
      addressId = null;
    } else if (addressId) {
      await tx.address.update({ where: { id: addressId }, data: { line1 } });
    } else {
      addressId = (await tx.address.create({ data: { line1 } })).id;
    }

    const data = { homeAddressId: addressId };
    const where = { id: profile.id };
    if (kind === 'student') await tx.studentProfile.update({ where, data });
    else if (kind === 'teacher')
      await tx.teacherProfile.update({ where, data });
    else if (kind === 'staff') await tx.staffProfile.update({ where, data });
    else await tx.parentProfile.update({ where, data });
  }
}
