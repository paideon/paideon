import { Module } from "@nestjs/common";
import { PrismaModule } from "../modules/prisma/prisma.module";

@Module({
  imports: [PrismaModule], // global database access - available everywhere
  controllers: [],
  providers: [],
})
export class AppModule {}
