import { SetMetadata } from '@nestjs/common';
import type { CapabilityEnumData } from '@paideon/contracts';

export const REQUIRED_CAPABILITIES_KEY = 'requiredCapabilities';

/**
 * Marks a route (or a whole controller) as needing one of these capabilities
 * at ANY scope. Services then narrow the result to the scope the person holds
 * (see scope.ts). Use together with JwtAuthGuard and CapabilityGuard:
 *
 *   @UseGuards(JwtAuthGuard, CapabilityGuard)
 *   @RequireCapability('people.read')
 */
export const RequireCapability = (...capabilities: CapabilityEnumData[]) =>
  SetMetadata(REQUIRED_CAPABILITIES_KEY, capabilities);
