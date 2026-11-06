import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalDiskStorage } from './local-disk.storage';
import { MediaController } from './media.controller';
import { MediaUrlService } from './media-url.service';
import { PhotoService } from './photo.service';
import { STORAGE_DRIVER } from './storage.driver';

// STORAGE_DRIVER=local (the default) keeps files on this server's disk. To add
// another driver, write a class that implements StorageDriver and add a case.
@Global()
@Module({
  controllers: [MediaController],
  providers: [
    LocalDiskStorage,
    {
      provide: STORAGE_DRIVER,
      inject: [ConfigService, LocalDiskStorage],
      useFactory: (config: ConfigService, local: LocalDiskStorage) => {
        const driver = config.get<string>('STORAGE_DRIVER') ?? 'local';
        if (driver === 'local') return local;
        throw new Error(`Unknown STORAGE_DRIVER "${driver}". Use "local".`);
      },
    },
    MediaUrlService,
    PhotoService,
  ],
  exports: [STORAGE_DRIVER, MediaUrlService, PhotoService],
})
export class StorageModule {}
