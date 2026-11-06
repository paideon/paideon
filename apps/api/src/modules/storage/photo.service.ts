import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  PHOTO_MAX_BYTES,
  PHOTO_SIZES,
  type StudentPhotoUploadData,
} from '@paideon/contracts';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoSizeName } from './media-url.service';
import { STORAGE_DRIVER, type StorageDriver } from './storage.driver';

/** Storage key of one size of a photo whose Media row has key `base`. */
export function photoKey(base: string, size: PhotoSizeName): string {
  return `${base}-${size}.jpg`;
}

// Real image formats start with these bytes. The browser's own claim about the
// file type is not trusted.
function looksLikeImage(data: Buffer): boolean {
  const jpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  const png = data.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
  const webp =
    data.subarray(0, 4).toString('ascii') === 'RIFF' &&
    data.subarray(8, 12).toString('ascii') === 'WEBP';
  return jpeg || png || webp;
}

@Injectable()
export class PhotoService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_DRIVER) private readonly storage: StorageDriver,
  ) {}

  /**
   * Crops the photo to a square, makes the three sizes and saves them. Returns
   * the new Media row; attaching it to a person is the caller's job.
   */
  async saveProfilePhoto(args: {
    schoolId: string;
    ownerUserId: string;
    uploadedBy: string;
    data: Buffer;
    crop: StudentPhotoUploadData;
  }) {
    const { data, crop } = args;
    if (data.length === 0) throw new BadRequestException('Choose a photo.');
    if (data.length > PHOTO_MAX_BYTES) {
      throw new BadRequestException('The photo must be 5 MB or smaller.');
    }
    if (!looksLikeImage(data)) {
      throw new BadRequestException('Use a JPG, PNG or WebP photo.');
    }

    let source: sharp.Sharp;
    let width: number;
    let height: number;
    try {
      // rotate() applies the phone camera's orientation before anything else.
      const oriented = await sharp(data)
        .rotate()
        .toBuffer({ resolveWithObject: true });
      width = oriented.info.width;
      height = oriented.info.height;
      source = sharp(oriented.data);
    } catch {
      throw new BadRequestException('That file could not be read as a photo.');
    }

    // The crop arrives as fractions of the shorter side's square. Clamp it
    // inside the image so a wrong value never fails.
    const shortSide = Math.min(width, height);
    const side = Math.max(1, Math.round(crop.cropSize * shortSide));
    const left = Math.min(Math.round(crop.cropX * width), width - side);
    const top = Math.min(Math.round(crop.cropY * height), height - side);
    const square = await source
      .extract({
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: side,
        height: side,
      })
      .toBuffer();

    const base = `profile/${args.ownerUserId}/${randomUUID()}`;
    let largeBytes = 0;
    for (const [name, pixels] of Object.entries(PHOTO_SIZES) as [
      PhotoSizeName,
      number,
    ][]) {
      const out = await sharp(square)
        .resize(pixels, pixels, { fit: 'cover' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      if (name === 'large') largeBytes = out.length;
      await this.storage.put(photoKey(base, name), out);
    }

    return this.prisma.media.create({
      data: {
        schoolId: args.schoolId,
        uploadedBy: args.uploadedBy,
        bucket: this.storage.name,
        key: base,
        filename: 'photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: largeBytes,
        width: PHOTO_SIZES.large,
        height: PHOTO_SIZES.large,
        purpose: 'PROFILE_IMAGE',
        isPublic: false,
      },
    });
  }

  /** Removes the files of a replaced photo and marks its row deleted. */
  async discard(mediaId: string | null | undefined) {
    if (!mediaId) return;
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      select: { key: true },
    });
    if (!media) return;
    await this.prisma.media.update({
      where: { id: mediaId },
      data: { deletedAt: new Date() },
    });
    for (const size of Object.keys(PHOTO_SIZES) as PhotoSizeName[]) {
      await this.storage.delete(photoKey(media.key, size));
    }
  }
}
