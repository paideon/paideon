import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CapabilityGrantData } from '@paideon/contracts';

/** The signed-in person's grants, as loaded by CapabilityGuard. */
export const Grants = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CapabilityGrantData[] => {
    const request = context.switchToHttp().getRequest();
    return request.grants ?? [];
  },
);
