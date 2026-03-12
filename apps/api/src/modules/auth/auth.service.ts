import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtPayload } from "./types/jwt-payload.type";
import { LoginDto } from "./dto/login.dto";
import { ActivateDto } from "./dto/activate.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const isPaideonId = dto.identifier.includes("-");

    // FIX 1: email is not unique alone in our schema.
    // It is part of a compound unique (email + schoolId).
    // So we use findFirst instead of findUnique.
    const user = await this.prisma.user.findFirst({
      where: isPaideonId
        ? { paideonId: dto.identifier }
        : { email: dto.identifier },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.status === "PENDING") {
      throw new ForbiddenException("Account not activated. Check your email.");
    }

    if (user.status === "SUSPENDED") {
      throw new ForbiddenException(
        "Account suspended. Contact your administrator.",
      );
    }

    if (user.status === "GRADUATED" || user.status === "INACTIVE") {
      throw new UnauthorizedException("Invalid credentials");
    }

    // FIX 2: user.password is string | null in the schema
    // (PENDING users have no password yet).
    // We already blocked PENDING above, but TypeScript doesn't know that.
    // Explicit check makes it clear and satisfies the type system.
    if (!user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens({
      sub: user.id,
      schoolId: user.schoolId,
      role: user.role,
      paideonId: user.paideonId,
    });
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
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Reuse detection — token found but already revoked.
    // Revoke all active sessions for this user immediately.
    if (storedToken.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException(
        "Token reuse detected. All sessions revoked.",
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException("Session expired. Please log in again.");
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Account is no longer active.");
    }

    return this.generateTokens({
      sub: user.id,
      schoolId: user.schoolId,
      role: user.role,
      paideonId: user.paideonId,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // REQUEST ACTIVATION
  // ─────────────────────────────────────────────────────────────

  async requestActivation(email: string) {
    // FIX 3: email is not unique alone — use findFirst.
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user || user.status !== "PENDING") {
      return;
    }

    const rawToken = randomBytes(32).toString("hex");
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

  async confirmActivation(dto: ActivateDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const tokenHash = this.hashToken(dto.token);

    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

    if (!verificationToken) {
      throw new BadRequestException("Invalid or expired activation link");
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException(
        "Activation link has expired. Request a new one.",
      );
    }

    if (verificationToken.verifiedAt) {
      throw new BadRequestException(
        "This activation link has already been used.",
      );
    }

    const user = verificationToken.user;

    if (user.status !== "PENDING") {
      throw new BadRequestException("This account is already activated.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: passwordHash,
          status: "ACTIVE",
          emailVerified: true,
        },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { verifiedAt: new Date() },
      }),
    ]);

    return this.generateTokens({
      sub: user.id,
      schoolId: user.schoolId,
      role: user.role,
      paideonId: user.paideonId,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    // FIX 5: same as requestActivation — use findFirst.
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user || user.status !== "ACTIVE") {
      return;
    }

    const rawToken = randomBytes(32).toString("hex");
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

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const tokenHash = this.hashToken(dto.token);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException("Invalid or expired reset link");
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException(
        "Reset link has expired. Request a new one.",
      );
    }

    if (resetToken.usedAt) {
      throw new BadRequestException("This reset link has already been used.");
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

  private async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_SECRET")!,
      expiresIn: "15m",
    });

    // FIX 6: expiresIn type mismatch.
    // getRefreshExpiry returns a plain string like '8h' or '30d'.
    // The JWT library expects its own StringValue type.
    // Casting with 'as any' bypasses the type check safely here —
    // the values are valid JWT duration strings, TypeScript just
    // doesn't know that.
    const rawRefreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET")!,
      expiresIn: this.getRefreshExpiry(payload.role) as any,
    });

    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = this.getRefreshExpiryDate(payload.role);

    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        tokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private getRefreshExpiry(role: string): string {
    const expiries: Record<string, string> = {
      ADMIN: "8h",
      LIBRARIAN: "12h",
      STAFF: "12h",
      TEACHER: "30d",
      STUDENT: "30d",
      PARENT: "30d",
    };
    return expiries[role] ?? "30d";
  }

  private getRefreshExpiryDate(role: string): Date {
    const ms: Record<string, number> = {
      ADMIN: 8 * 60 * 60 * 1000,
      LIBRARIAN: 12 * 60 * 60 * 1000,
      STAFF: 12 * 60 * 60 * 1000,
      TEACHER: 30 * 24 * 60 * 60 * 1000,
      STUDENT: 30 * 24 * 60 * 60 * 1000,
      PARENT: 30 * 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + (ms[role] ?? ms["STUDENT"]));
  }
}
