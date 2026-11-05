import { Global, Module } from '@nestjs/common';
import { CapabilityGuard } from './capability.guard';
import { CapabilityService } from './capability.service';

@Global()
@Module({
  providers: [CapabilityService, CapabilityGuard],
  exports: [CapabilityService, CapabilityGuard],
})
export class AccessModule {}
