// requires.decorator.ts
//
// Labels a route with the capabilities that open it. The person needs ANY ONE
// of the capabilities listed. By itself it does nothing; capability.guard.ts
// reads the label and decides.
//
//   @UseGuards(JwtAuthGuard, CapabilityGuard)   <- attach the guards
//   @Requires('library.desk')                    <- one capability
//   @Requires('library.reports', 'library.desk') <- either of these
//
// Code never asks "is this person a librarian?". It asks what they may do.

import { SetMetadata } from '@nestjs/common';
import type { CapabilityEnumData } from '@paideon/contracts';

export const REQUIRES_KEY = 'requires_capabilities';

export const Requires = (...capabilities: CapabilityEnumData[]) =>
  SetMetadata(REQUIRES_KEY, capabilities);
