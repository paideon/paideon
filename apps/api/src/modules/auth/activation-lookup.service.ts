import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import type { ActivationInfoData } from '@paideon/contracts';
import { PrismaService } from '../prisma/prisma.service';

// Read-only lookup behind GET /api/auth/activate/:token.
//
// The activation page calls this to show the person their name and email
// before they pick a password. It never marks the token as used: only
// AuthService.confirmActivation does that.

const TOKEN_MAX_LENGTH = 256;
const INVALID_LINK = 'Invalid or expired activation link';

@Injectable()
export class ActivationLookupService {
  constructor(private prisma: PrismaService) {}

  async describe(token: string): Promise<ActivationInfoData> {
    if (!token || token.length > TOKEN_MAX_LENGTH) {
      throw new BadRequestException(INVALID_LINK);
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
    });

    // One message for every failure, so the response does not tell an
    // attacker whether a token ever existed.
    if (
      !record ||
      record.verifiedAt ||
      record.expiresAt < new Date() ||
      record.user.status !== 'PENDING'
    ) {
      throw new BadRequestException(INVALID_LINK);
    }

    return {
      firstName: record.user.firstName,
      lastName: record.user.lastName,
      email: record.user.email,
    };
  }
}
