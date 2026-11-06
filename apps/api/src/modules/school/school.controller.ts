import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ClassListData } from '@paideon/contracts';
import { CapabilityGuard } from '../access/capability.guard';
import { RequireCapability } from '../access/require-capability.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';

@Controller('school')
@UseGuards(JwtAuthGuard, CapabilityGuard)
export class SchoolController {
  constructor(private readonly prisma: PrismaService) {}

  // The classes of the current academic year, for pickers and filters. Class
  // names are not sensitive, so anyone who can read or edit people may list them.
  @Get('classes')
  @RequireCapability('people.read', 'people.write')
  async classes(@CurrentUser() user: JwtPayload): Promise<ClassListData> {
    const rows = await this.prisma.class.findMany({
      where: { schoolId: user.schoolId, academicYear: { isCurrent: true } },
      orderBy: [{ grade: 'asc' }, { section: 'asc' }],
      select: {
        id: true,
        grade: true,
        section: true,
        _count: { select: { classEnrollments: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      grade: row.grade,
      section: row.section,
      label: `${row.grade}-${row.section}`,
      studentCount: row._count.classEnrollments,
    }));
  }
}
