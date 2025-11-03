import { Global, Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { CapabilityGuard } from './guards/capability.guard';

// Global so any module can put @Requires() on a route without importing this.
@Global()
@Module({
  controllers: [AccessController],
  providers: [AccessService, CapabilityGuard],
  exports: [AccessService, CapabilityGuard],
})
export class AccessModule {}
