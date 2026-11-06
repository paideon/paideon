import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import {
  AssignClassSchema,
  BadgePrintSchema,
  ChangeStudentStatusSchema,
  CreateStudentSchema,
  MAX_BADGES_PER_PRINT,
  PaginationQuerySchema,
  PHOTO_MAX_BYTES,
  StudentListQuerySchema,
  StudentPhotoUploadSchema,
  UpdateStudentSchema,
} from '@paideon/contracts';
import type {
  AssignClassData,
  BadgePrintData,
  CapabilityGrantData,
  ChangeStudentStatusData,
  CreateStudentData,
  PaginationQueryData,
  StudentListQueryData,
  StudentPhotoUploadData,
  UpdateStudentData,
} from '@paideon/contracts';
import { CapabilityGuard } from '../access/capability.guard';
import { Grants } from '../access/grants.decorator';
import { RequireCapability } from '../access/require-capability.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ZodBody, ZodQuery } from '../../common/pipes/zod-validation.pipe';
import { StudentsService, type RequestContext } from './students.service';

const BadgesQuerySchema = StudentListQuerySchema.pick({ ids: true });

const contextOf = (req: Request): RequestContext => ({
  ipAddress: req.ip ?? req.socket.remoteAddress,
  userAgent: req.get('user-agent'),
});

type PhotoUpload = { buffer: Buffer; size: number };

// Route order matters: the fixed paths (export.csv, badges, assign-class) come
// before ':id', or ':id' would swallow them.
@Controller('people/students')
@UseGuards(JwtAuthGuard, CapabilityGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  @RequireCapability('people.read')
  list(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodQuery(StudentListQuerySchema) query: StudentListQueryData,
  ) {
    return this.students.list(user, grants, query);
  }

  @Get('export.csv')
  @RequireCapability('people.read')
  async exportCsv(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodQuery(StudentListQuerySchema) query: StudentListQueryData,
    @Res() res: Response,
  ) {
    const csv = await this.students.exportCsv(user, grants, query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    res.setHeader('Cache-Control', 'no-store');
    res.send(csv);
  }

  // Badges need less than the whole profile, so the library desk may print them.
  @Get('badges')
  @RequireCapability('people.read', 'library.members.read')
  badges(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodQuery(BadgesQuerySchema) query: { ids?: string[] },
  ) {
    const ids = query.ids ?? [];
    if (ids.length === 0 || ids.length > MAX_BADGES_PER_PRINT) {
      throw new BadRequestException(
        `Choose between 1 and ${MAX_BADGES_PER_PRINT} students.`,
      );
    }
    return this.students.badges(user, grants, ids);
  }

  @Post('badge-print')
  @RequireCapability('people.read', 'library.members.read')
  async badgePrint(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodBody(BadgePrintSchema) dto: BadgePrintData,
    @Req() req: Request,
  ) {
    const recorded = await this.students.recordBadgePrint(
      dto.studentIds,
      user,
      grants,
      contextOf(req),
    );
    return { recorded };
  }

  @Post('assign-class')
  @RequireCapability('people.write')
  assignClass(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodBody(AssignClassSchema) dto: AssignClassData,
    @Req() req: Request,
  ) {
    return this.students.assignClass(dto, user, grants, contextOf(req));
  }

  @Post()
  @RequireCapability('people.write')
  create(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @ZodBody(CreateStudentSchema) dto: CreateStudentData,
    @Req() req: Request,
  ) {
    return this.students.create(dto, user, grants, contextOf(req));
  }

  @Get(':id')
  @RequireCapability('people.read')
  get(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
  ) {
    return this.students.get(id, user, grants);
  }

  @Patch(':id')
  @RequireCapability('people.write')
  update(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
    @ZodBody(UpdateStudentSchema) dto: UpdateStudentData,
    @Req() req: Request,
  ) {
    return this.students.update(id, dto, user, grants, contextOf(req));
  }

  @Post(':id/status')
  @RequireCapability('people.write')
  changeStatus(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
    @ZodBody(ChangeStudentStatusSchema) dto: ChangeStudentStatusData,
    @Req() req: Request,
  ) {
    return this.students.changeStatus(id, dto, user, grants, contextOf(req));
  }

  // multipart/form-data: the file in "file", the crop as plain fields.
  @Post(':id/photo')
  @RequireCapability('people.write')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: PHOTO_MAX_BYTES } }),
  )
  setPhoto(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
    @ZodBody(StudentPhotoUploadSchema) crop: StudentPhotoUploadData,
    @UploadedFile() file: PhotoUpload | undefined,
    @Req() req: Request,
  ) {
    if (!file?.buffer) throw new BadRequestException('Choose a photo.');
    return this.students.setPhoto(
      id,
      file.buffer,
      crop,
      user,
      grants,
      contextOf(req),
    );
  }

  // library.members.read is checked here; seeing the student at all (people.read
  // at the right scope) is checked by the service, which answers 404 otherwise.
  @Get(':id/library')
  @RequireCapability('library.members.read')
  library(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
  ) {
    return this.students.libraryRecord(id, user, grants);
  }

  @Get(':id/activity')
  @RequireCapability('people.read')
  activity(
    @CurrentUser() user: JwtPayload,
    @Grants() grants: CapabilityGrantData[],
    @Param('id') id: string,
    @ZodQuery(PaginationQuerySchema) query: PaginationQueryData,
  ) {
    return this.students.activity(id, user, grants, query.page, query.pageSize);
  }
}
