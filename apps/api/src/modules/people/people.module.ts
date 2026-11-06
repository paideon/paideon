import { Module } from '@nestjs/common';
import { LibraryModule } from '../library/library.module';
import { PaideonIdsService } from './paideon-ids.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [LibraryModule],
  controllers: [StudentsController],
  providers: [StudentsService, PaideonIdsService],
  exports: [PaideonIdsService],
})
export class PeopleModule {}
