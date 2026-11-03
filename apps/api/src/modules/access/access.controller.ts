import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  AssignRoleSchema,
  CreateGrantSchema,
  CreateRoleSchema,
  UpdateRoleSchema,
} from '@paideon/contracts';
import type {
  AssignRoleData,
  CreateGrantData,
  CreateRoleData,
  UpdateRoleData,
} from '@paideon/contracts';
import { ZodBody } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AccessService } from './access.service';
import { Requires } from './decorators/requires.decorator';
import { CapabilityGuard } from './guards/capability.guard';

// Roles, who holds them, and extra grants. Everything here needs access.manage.
@Controller('access')
@UseGuards(JwtAuthGuard, CapabilityGuard)
@Requires('access.manage')
export class AccessController {
  constructor(private readonly access: AccessService) {}

  private context(req: Request) {
    return {
      ipAddress: req.ip ?? req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };
  }

  @Get('capabilities')
  capabilities() {
    return this.access.listCapabilities();
  }

  @Get('roles')
  roles(@CurrentUser() user: JwtPayload) {
    return this.access.listRoles(user.schoolId);
  }

  @Post('roles')
  createRole(
    @CurrentUser() user: JwtPayload,
    @ZodBody(CreateRoleSchema) dto: CreateRoleData,
    @Req() req: Request,
  ) {
    return this.access.createRole(user, dto, this.context(req));
  }

  @Patch('roles/:id')
  updateRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @ZodBody(UpdateRoleSchema) dto: UpdateRoleData,
    @Req() req: Request,
  ) {
    return this.access.updateRole(user, id, dto, this.context(req));
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    await this.access.deleteRole(user, id, this.context(req));
  }

  @Get('members/:userId')
  member(@CurrentUser() user: JwtPayload, @Param('userId') userId: string) {
    return this.access.memberAccess(user.schoolId, userId);
  }

  @Post('members/:userId/roles')
  assignRole(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @ZodBody(AssignRoleSchema) dto: AssignRoleData,
    @Req() req: Request,
  ) {
    return this.access.assignRole(user, userId, dto, this.context(req));
  }

  @Delete('members/:userId/roles/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string,
    @Req() req: Request,
  ) {
    await this.access.removeRole(user, userId, assignmentId, this.context(req));
  }

  @Post('members/:userId/grants')
  addGrant(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @ZodBody(CreateGrantSchema) dto: CreateGrantData,
    @Req() req: Request,
  ) {
    return this.access.addGrant(user, userId, dto, this.context(req));
  }

  @Delete('members/:userId/grants/:grantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGrant(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @Param('grantId') grantId: string,
    @Req() req: Request,
  ) {
    await this.access.removeGrant(user, userId, grantId, this.context(req));
  }
}
