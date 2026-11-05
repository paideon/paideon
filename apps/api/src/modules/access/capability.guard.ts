import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { CapabilityEnumData } from '@paideon/contracts';
import { CapabilityService } from './capability.service';
import { REQUIRED_CAPABILITIES_KEY } from './require-capability.decorator';
import { holds } from './scope';

// Runs after JwtAuthGuard. Loads the person's grants, keeps them on the
// request for the handler (see @Grants()), and refuses the request when none
// of the capabilities named by @RequireCapability() is held.
@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly capabilities: CapabilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<
      CapabilityEnumData[] | undefined
    >(REQUIRED_CAPABILITIES_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();
    const user = request.user as { sub?: string } | undefined;
    if (!user?.sub) throw new ForbiddenException('Not signed in.');

    const grants = await this.capabilities.grantsFor(user.sub);
    request.grants = grants;

    // No @RequireCapability(): signed-in people are allowed.
    if (!required || required.length === 0) return true;

    if (required.some((capability) => holds(grants, capability))) return true;
    throw new ForbiddenException({
      statusCode: 403,
      message: 'You do not have access to this.',
      code: 'MISSING_CAPABILITY',
    });
  }
}
