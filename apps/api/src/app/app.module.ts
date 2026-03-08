// app.module.ts
//
// The root module of the entire API.
// Think of it as the master registry — every feature module
// gets listed here. NestJS reads this file first when the
// app starts and builds the entire dependency tree from it.
//
// As we add more features (library, users, exams etc.)
// each new module gets imported here.

import { Module } from "@nestjs/common";
import { PrismaModule } from "../modules/prisma/prisma.module";

@Module({
  imports: [
    PrismaModule, // global database access — available everywhere
  ],
  controllers: [], // no root-level controllers
  providers: [], // no root-level providers
})
export class AppModule {}
