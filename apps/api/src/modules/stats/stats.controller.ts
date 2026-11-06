import { Controller, Get, UseGuards } from '@nestjs/common';
import type {
  CapabilityGrantData,
  SchoolSnapshotData,
} from '@paideon/contracts';
import { CapabilityGuard } from '../access/capability.guard';
import { Grants } from '../access/grants.decorator';
import { RequireCapability } from '../access/require-capability.decorator';
import { reachFor } from '../access/scope';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { studentScopeWhere } from '../people/student-scope';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stats')
@UseGuards(JwtAuthGuard, CapabilityGuard)
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  // The numbers on the People landing page. Student counts follow the
  // person's scope (a section head sees their grades); teacher and staff
  // counts are shown to everyone who may read people.
  @Get('snapshot')
  @RequireCapability('people.read')
  async snapshot(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
  ): Promise<SchoolSnapshotData> {
    const schoolId = user.schoolId;
    const year = await this.prisma.academicYear.findFirst({
      where: { schoolId, isCurrent: true },
      select: { id: true, label: true },
    });
    const reach = reachFor(grants, 'people.read');
    const scope = studentScopeWhere(reach, year?.id ?? null);
    const activeStudents = {
      AND: [
        { schoolId, kind: 'STUDENT' as const, deletedAt: null },
        scope,
        { studentProfile: { is: { enrollmentStatus: 'ACTIVE' as const } } },
      ],
    };

    const [
      students,
      teachers,
      staff,
      notActivatedStudents,
      notActivatedOthers,
      missing,
    ] = await Promise.all([
      this.prisma.user.count({ where: activeStudents }),
      this.prisma.user.count({
        where: {
          schoolId,
          kind: 'TEACHER',
          deletedAt: null,
          status: { not: 'INACTIVE' },
        },
      }),
      this.prisma.user.count({
        where: {
          schoolId,
          kind: 'STAFF',
          deletedAt: null,
          status: { not: 'INACTIVE' },
        },
      }),
      this.prisma.user.count({
        where: { AND: [activeStudents, { status: 'PENDING' }] },
      }),
      reach.school
        ? this.prisma.user.count({
            where: {
              schoolId,
              kind: { in: ['TEACHER', 'STAFF'] },
              deletedAt: null,
              status: 'PENDING',
            },
          })
        : Promise.resolve(0),
      this.prisma.user.count({
        where: {
          AND: [
            activeStudents,
            {
              OR: [
                { profileImageId: null },
                { emergencyContacts: { none: { phone: { not: '' } } } },
                ...(year
                  ? [
                      {
                        classEnrollments: { none: { academicYearId: year.id } },
                      },
                    ]
                  : []),
              ],
            },
          ],
        },
      }),
    ]);

    return {
      students,
      teachers,
      staff,
      accountsNotActivated: notActivatedStudents + notActivatedOthers,
      recordsMissingData: missing,
      academicYear: year?.label ?? null,
    };
  }
}
