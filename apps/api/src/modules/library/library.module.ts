import { Module } from '@nestjs/common';
import { LibraryController, MyLibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  controllers: [LibraryController, MyLibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
