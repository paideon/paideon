import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { AccessModule } from '../modules/access/access.module';
import { AuditModule } from '../modules/audit/audit.module';
import { AuthModule } from '../modules/auth/auth.module';
import { LibraryModule } from '../modules/library/library.module';
import { MeModule } from '../modules/me/me.module';
import { PeopleModule } from '../modules/people/people.module';
import { SchoolModule } from '../modules/school/school.module';
import { StatsModule } from '../modules/stats/stats.module';
import { StorageModule } from '../modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AccessModule,
    AuditModule,
    StorageModule,
    AuthModule,
    LibraryModule,
    MeModule,
    PeopleModule,
    SchoolModule,
    StatsModule,
  ],
})
export class AppModule {}
