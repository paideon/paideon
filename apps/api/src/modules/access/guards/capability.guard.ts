// capability.guard.ts
//
// The enforcer that pairs with @Requires(). JwtAuthGuard must run first, so
// that request.user is filled in.
//
// It fails CLOSED: a route that has this guard but no @Requires() label is
// refused, so forgetting the label can never leave a route open.

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { holdsCapability, type CapabilityEnumData } from '@paideon/contracts';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import { AccessService } from '../access.service';
import { REQUIRES_KEY } from '../decorators/requires.decorator';

@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly access: AccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<
      CapabilityEnumData[] | undefined
    >(REQUIRES_KEY, [context.getHandler(), context.getClass()]);

    if (!required || required.length === 0) {
      throw new ForbiddenException('This route has no access rule.');
    }

    const user = context.switchToHttp().getRequest().user as
      JwtPayload | undefined;
    if (!user) throw new ForbiddenException('Not signed in.');

    const held = await this.access.capabilitiesFor(user);
    const allowed = required.some((capability) =>
      holdsCapability(held, capability),
    );
    if (!allowed) throw new ForbiddenException('You do not have access.');
    return true;
  }
}
