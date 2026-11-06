import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

export const PHOTO_SIZE_NAMES = ['small', 'medium', 'large'] as const;
export type PhotoSizeName = (typeof PHOTO_SIZE_NAMES)[number];

const URL_LIFETIME_SECONDS = 2 * 60 * 60;

// A photo is shown in an <img> tag, which cannot send the sign-in token, so
// the API hands out links that carry their own proof: the media id, the size
// and an expiry time, signed with a server secret. A link stops working after
// two hours and cannot be changed to point at another photo.
@Injectable()
export class MediaUrlService {
  private readonly secret: string;
  private readonly publicBase: string;

  constructor(config: ConfigService) {
    this.secret =
      config.get<string>('MEDIA_URL_SECRET') ??
      config.getOrThrow<string>('JWT_SECRET');
    this.publicBase = (
      config.get<string>('API_PUBLIC_URL') ?? 'http://localhost:3001'
    ).replace(/\/+$/, '');
  }

  private sign(mediaId: string, size: string, expires: number): string {
    return createHmac('sha256', this.secret)
      .update(`${mediaId}.${size}.${expires}`)
      .digest('base64url');
  }

  /** A signed link to one size of a profile photo, or null when there is no photo. */
  profilePhotoUrl(
    mediaId: string | null | undefined,
    size: PhotoSizeName,
    now: number = Date.now(),
  ): string | null {
    if (!mediaId) return null;
    const expires = Math.floor(now / 1000) + URL_LIFETIME_SECONDS;
    const sig = this.sign(mediaId, size, expires);
    return `${this.publicBase}/api/media/${mediaId}/${size}?exp=${expires}&sig=${sig}`;
  }

  verify(
    mediaId: string,
    size: string,
    expires: number,
    signature: string,
    now: number = Date.now(),
  ): boolean {
    if (!Number.isFinite(expires) || expires * 1000 < now) return false;
    const expected = Buffer.from(this.sign(mediaId, size, expires));
    const given = Buffer.from(signature);
    return expected.length === given.length && timingSafeEqual(expected, given);
  }
}
