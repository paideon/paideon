import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { AuditModule } from '../modules/audit/audit.module';
import { AuthModule } from '../modules/auth/auth.module';
import { LibraryModule } from '../modules/library/library.module';
import { AccountModule } from '../modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    AuthModule,
    LibraryModule,
    AccountModule,
  ],
})
export class AppModule {}
