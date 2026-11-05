import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import type { PersonKind } from '@paideon/database/generated/client/client';
import type {
  CapabilityEnumData,
  ConfirmActivationData,
  ForgotPasswordData,
  LoginRequestData,
  ResetPasswordData,
} from '@paideon/contracts';
import { CapabilityService } from '../access/capability.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwt-payload.type';

// Lockout: after this many failed sign-ins for one identifier inside the
// window (counted since its last successful sign-in), further attempts are
// refused for the rest of the window, even with the right password.
const LOCKOUT_MAX_FAILURES = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOCKED_REASON = 'Account temporarily locked';

// Holding any of these shortens the sign-in to 8 hours.
const SHORT_SESSION_CAPABILITIES: CapabilityEnumData[] = [
  'access.manage',
  'accounts.manage',
  'settings.manage',
  'school.manage',
  'people.write',
];

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private capabilities: CapabilityService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────

  async login(
    dto: LoginRequestData,
    context: { ipAddress: string; userAgent?: string },
  ) {
    const isEmail = dto.identifier.includes('@');

    // Same "Invalid credentials" response as a wrong password, so the
    // lockout does not reveal whether the account exists.
    if (await this.isLockedOut(dto.identifier)) {
      return this.rejectLogin(
        dto.identifier,
        context,
        new UnauthorizedException('Invalid credentials'),
        LOCKED_REASON,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: isEmail
        ? { email: dto.identifier }
        : { paideonId: dto.identifier },
    });

    if (!user) return this.rejectLogin(dto.identifier, context);

    if (user.status === 'PENDING') {
      return this.rejectLogin(
        dto.identifier,
        context,
        new ForbiddenException({
          message: 'Account not activated. Check your email.',
          code: 'EMAIL_NOT_VERIFIED',
        }),
      );
    }

    if (user.status === 'SUSPENDED') {
      return this.rejectLogin(
        dto.identifier,
        context,
        new ForbiddenException({
          message: 'Account suspended. Contact your administrator.',
          code: 'ACCOUNT_SUSPENDED',
        }),
      );
    }

    if (user.status === 'GRADUATED' || user.status === 'INACTIVE') {
      return this.rejectLogin(dto.identifier, context);
    }

    // FIX 2: user.password is string | null in the schema
    // (PENDING users have no password yet).
    // We already blocked PENDING above, but TypeScript doesn't know that.
    // Explicit check makes it clear and satisfies the type system.
    if (!user.password) {
      return this.rejectLogin(dto.identifier, context);
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      return this.rejectLogin(dto.identifier, context);
    }

    await this.prisma.loginAttempt.create({
      data: {
        email: dto.identifier,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        success: true,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(
      {
        sub: user.id,
        schoolId: user.schoolId,
        kind: user.kind,
        paideonId: user.paideonId,
      },
      context,
    );
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        schoolId: true,
        paideonId: true,
        email: true,
        kind: true,
        profileImageId: true,
        status: true,
        firstName: true,
        lastName: true,
        displayName: true,
        cardNumber: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is no longer active.');
    }

    return user;
  }

  // ─────────────────────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────────────────────

  async logout(rawRefreshToken: string) {
    const hash = this.hashToken(rawRefreshToken);

    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
    });

    if (!token || token.revokedAt) {
      return;
    }

    await this.prisma.refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // REFRESH TOKENS
  // ─────────────────────────────────────────────────────────────

  async refreshTokens(userId: string, rawRefreshToken: string) {
    const hash = this.hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Reuse detection — token found but already revoked.
    // Revoke all active sessions for this user immediately.
    if (storedToken.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException(
        'Token reuse detected. All sessions revoked.',
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is no longer active.');
    }

    return this.generateTokens(
      {
        sub: user.id,
        schoolId: user.schoolId,
        kind: user.kind,
        paideonId: user.paideonId,
      },
      {
        // The session keeps the place it was started from.
        ipAddress: storedToken.ipAddress ?? undefined,
        userAgent: storedToken.userAgent ?? undefined,
      },
    );
  }

  // ─────────────────────────────────────────────────────────────
  // REQUEST ACTIVATION
  // ─────────────────────────────────────────────────────────────

  async requestActivation(email: string) {
    // FIX 3: email is not unique alone — use findFirst.
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user || user.status !== 'PENDING') {
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // FIX 4: emailVerificationToken requires email field in our schema.
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        tokenHash,
        expiresAt,
      },
    });

    // TODO: replace with real email service in email module.
    console.log(`[DEV] Activation token for ${email}: ${rawToken}`);
  }

  // ─────────────────────────────────────────────────────────────
  // CONFIRM ACTIVATION
  // ─────────────────────────────────────────────────────────────

  async confirmActivation(
    dto: ConfirmActivationData,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    // Password rules and "passwords match" are already enforced by
    // ConfirmActivationSchema before this method is called.
    const tokenHash = this.hashToken(dto.token);

    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired activation link');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException(
        'Activation link has expired. Request a new one.',
      );
    }

    if (verificationToken.verifiedAt) {
      throw new BadRequestException(
        'This activation link has already been used.',
      );
    }

    const user = verificationToken.user;

    if (user.status !== 'PENDING') {
      throw new BadRequestException('This account is already activated.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: passwordHash,
          status: 'ACTIVE',
          emailVerified: true,
        },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { verifiedAt: new Date() },
      }),
    ]);

    return this.generateTokens(
      {
        sub: user.id,
        schoolId: user.schoolId,
        kind: user.kind,
        paideonId: user.paideonId,
      },
      context,
    );
  }

  // ─────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordData) {
    // FIX 5: same as requestActivation — use findFirst.
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user || user.status !== 'ACTIVE') {
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    console.log(`[DEV] Password reset token for ${dto.email}: ${rawToken}`);
  }

  // ─────────────────────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordData) {
    // Password rules and "passwords match" are already enforced by
    // ResetPasswordSchema before this method is called.
    const tokenHash = this.hashToken(dto.token);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException(
        'Reset link has expired. Request a new one.',
      );
    }

    if (resetToken.usedAt) {
      throw new BadRequestException('This reset link has already been used.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          password: passwordHash,
          passwordChangedAt: new Date(),
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE UTILITIES
  // ─────────────────────────────────────────────────────────────

  private async generateTokens(
    payload: JwtPayload,
    device?: { ipAddress?: string; userAgent?: string },
  ) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET')!,
      expiresIn: '15m',
    });

    // Sign-ins that can change other people's records end sooner than a
    // student's phone does. The lifetime is set in seconds.
    const lifetimeMs = await this.sessionLifetimeMs(payload.sub, payload.kind);
    const rawRefreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: Math.floor(lifetimeMs / 1000),
    });

    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + lifetimeMs);

    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        tokenHash,
        expiresAt,
        // Shown on the "where you are signed in" list.
        ipAddress: device?.ipAddress,
        userAgent: device?.userAgent?.slice(0, 300),
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private async isLockedOut(identifier: string): Promise<boolean> {
    const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);

    const lastSuccess = await this.prisma.loginAttempt.findFirst({
      where: { email: identifier, success: true, attemptedAt: { gte: since } },
      orderBy: { attemptedAt: 'desc' },
      select: { attemptedAt: true },
    });

    const failures = await this.prisma.loginAttempt.count({
      where: {
        email: identifier,
        success: false,
        // Refused-while-locked attempts do not extend the lockout.
        failureReason: { not: LOCKED_REASON },
        attemptedAt: { gte: lastSuccess?.attemptedAt ?? since },
      },
    });

    return failures >= LOCKOUT_MAX_FAILURES;
  }

  private async rejectLogin(
    identifier: string,
    context: { ipAddress: string; userAgent?: string },
    exception = new UnauthorizedException('Invalid credentials'),
    failureReason = exception.message,
  ): Promise<never> {
    await this.prisma.loginAttempt.create({
      data: {
        email: identifier,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        success: false,
        failureReason,
      },
    });
    throw exception;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // How long a sign-in lasts before the person must enter their password.
  // Decided by what the person may do, not by what kind of person they are.
  private async sessionLifetimeMs(
    userId: string,
    kind: PersonKind,
  ): Promise<number> {
    const hour = 60 * 60 * 1000;
    const grants = await this.capabilities.grantsFor(userId);
    const held = new Set(grants.map((grant) => grant.capability));
    const changesRecords = SHORT_SESSION_CAPABILITIES.some((capability) =>
      held.has(capability),
    );
    if (changesRecords) return 8 * hour;
    if (held.has('library.desk') || kind === 'STAFF') return 12 * hour;
    return 30 * 24 * hour;
  }
}
