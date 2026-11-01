import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UpdateMyContactSchema } from '@paideon/contracts';
import type { UpdateMyContactData } from '@paideon/contracts';
import { ZodBody } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { MeService } from './me.service';

// A person's own record. Every route works on the signed-in person only.
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private readonly me: MeService) {}

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload) {
    return this.me.profile(user);
  }

  @Patch('contact')
  updateContact(
    @CurrentUser() user: JwtPayload,
    @ZodBody(UpdateMyContactSchema) dto: UpdateMyContactData,
    @Req() req: Request,
  ) {
    return this.me.updateContact(user, dto, {
      ipAddress: req.ip ?? req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    });
  }
}
