import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ChangePasswordSchema,
  ConfirmActivationSchema,
  ForgotPasswordSchema,
  LoginRequestSchema,
  RequestActivationSchema,
  ResetPasswordSchema,
} from '@paideon/contracts';
import type {
  ChangePasswordData,
  ConfirmActivationData,
  ForgotPasswordData,
  LoginRequestData,
  RequestActivationData,
  ResetPasswordData,
} from '@paideon/contracts';
import { ZodBody } from '../../common/pipes/zod-validation.pipe';
import { CapabilityService } from '../access/capability.service';
import { MediaUrlService } from '../storage/media-url.service';
import { AuthService } from './auth.service';
import { AccountSecurityService } from './account-security.service';
import { ActivationLookupService } from './activation-lookup.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private activationLookup: ActivationLookupService,
    private accountSecurity: AccountSecurityService,
    private capabilities: CapabilityService,
    private media: MediaUrlService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/activate
  // ─────────────────────────────────────────────────────────────
  // User enters their school email to request an activation link.
  // Always returns 200 regardless of whether email exists.

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async requestActivation(
    @ZodBody(RequestActivationSchema) dto: RequestActivationData,
  ) {
    await this.authService.requestActivation(dto.email);
    return {
      message:
        'If this email is registered, you will receive an activation link.',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // GET /api/auth/activate/:token
  // ─────────────────────────────────────────────────────────────
  // The activation page asks who the link belongs to. Does NOT consume
  // the token. Throttled because it is a public token oracle.

  @Get('activate/:token')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async describeActivation(@Param('token') token: string) {
    return this.activationLookup.describe(token);
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/activate/confirm
  // ─────────────────────────────────────────────────────────────
  // User clicked activation link and submitted their password.
  // On success: auto-login — sets cookie and returns access token.

  @Post('activate/confirm')
  async confirmActivation(
    @ZodBody(ConfirmActivationSchema) dto: ConfirmActivationData,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.confirmActivation(dto, {
      ipAddress: req.ip ?? req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    });
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/login
  // ─────────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @ZodBody(LoginRequestSchema) dto: LoginRequestData,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto, {
      ipAddress: req.ip ?? req.socket.remoteAddress ?? 'unknown',
      userAgent: req.get('user-agent'),
    });
    this.setRefreshCookie(res, tokens.refreshToken);

    const response: { success: true; data: { accessToken: string } } = {
      success: true,
      data: { accessToken: tokens.accessToken },
    };

    return response;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    const { profileImageId, ...me } = await this.authService.getCurrentUser(
      user.sub,
    );
    const capabilities = await this.capabilities.grantsFor(me.id);
    return {
      ...me,
      photoUrl: this.media.profilePhotoUrl(profileImageId, 'small'),
      capabilities,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/change-password
  // ─────────────────────────────────────────────────────────────
  // Signed-in person changes their own password. Other sessions end;
  // this browser stays signed in.

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @ZodBody(ChangePasswordSchema) dto: ChangePasswordData,
    @Req() req: Request,
  ) {
    await this.accountSecurity.changePassword(user, dto, this.context(req));
    return { message: 'Password updated.' };
  }

  // ─────────────────────────────────────────────────────────────
  // GET /api/auth/sessions   DELETE /api/auth/sessions
  // ─────────────────────────────────────────────────────────────

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  sessions(@CurrentUser() user: JwtPayload, @Req() req: Request) {
    return this.accountSecurity.listSessions(user, this.context(req));
  }

  // "Sign out everywhere": ends every session including this one. Access
  // tokens already issued keep working until they expire (at most 15 minutes).
  @Delete('sessions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async signOutEverywhere(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ended = await this.accountSecurity.signOutEverywhere(
      user,
      this.context(req),
    );
    this.clearRefreshCookie(res);
    return { message: 'Signed out everywhere.', sessionsEnded: ended };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/refresh
  // ─────────────────────────────────────────────────────────────
  // Called silently by the portal every 15 minutes.
  // JwtRefreshGuard reads the httpOnly cookie and validates it.
  // Returns a new access token and rotates the refresh token.

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: JwtPayload & { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken,
    );
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/logout
  // ─────────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async logout(
    @CurrentUser() user: JwtPayload & { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.refreshToken);
    this.clearRefreshCookie(res);
    return { message: 'Logged out successfully.' };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/forgot-password
  // ─────────────────────────────────────────────────────────────

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@ZodBody(ForgotPasswordSchema) dto: ForgotPasswordData) {
    await this.authService.forgotPassword(dto);
    return {
      message: 'If this email is registered, you will receive a reset link.',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/reset-password
  // ─────────────────────────────────────────────────────────────

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@ZodBody(ResetPasswordSchema) dto: ResetPasswordData) {
    await this.authService.resetPassword(dto);
    return {
      message: 'Password updated. Please log in with your new password.',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────

  private context(req: Request) {
    return {
      refreshToken: req.cookies?.['refresh_token'] as string | undefined,
      ipAddress: req.ip ?? req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };
  }

  // Sets the refresh token as an httpOnly cookie on the response.
  // The cookie attributes match our security policy exactly.

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  // Clears the refresh token cookie on logout.

  private clearRefreshCookie(res: Response) {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
  }
}
