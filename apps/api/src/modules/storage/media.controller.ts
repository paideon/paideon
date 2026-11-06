import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import {
  MediaUrlService,
  PHOTO_SIZE_NAMES,
  type PhotoSizeName,
} from './media-url.service';
import { photoKey } from './photo.service';
import { Inject } from '@nestjs/common';
import { STORAGE_DRIVER, type StorageDriver } from './storage.driver';

// GET /api/media/:id/:size?exp=...&sig=...  (no sign-in: the link is the proof)
@Controller('media')
export class MediaController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly urls: MediaUrlService,
    @Inject(STORAGE_DRIVER) private readonly storage: StorageDriver,
  ) {}

  @Get(':id/:size')
  async serve(
    @Param('id') id: string,
    @Param('size') size: string,
    @Query('exp') exp: string | undefined,
    @Query('sig') sig: string | undefined,
    @Res() res: Response,
  ) {
    const valid =
      (PHOTO_SIZE_NAMES as readonly string[]).includes(size) &&
      typeof sig === 'string' &&
      this.urls.verify(id, size, Number(exp), sig);
    // The same answer for a bad link and a missing file.
    if (!valid) throw new NotFoundException();

    const media = await this.prisma.media.findFirst({
      where: { id, deletedAt: null },
      select: { key: true },
    });
    if (!media) throw new NotFoundException();

    const bytes = await this.storage.get(
      photoKey(media.key, size as PhotoSizeName),
    );
    if (!bytes) throw new NotFoundException();

    // helmet sends same-origin by default; the portal is another origin.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(bytes);
  }
}
