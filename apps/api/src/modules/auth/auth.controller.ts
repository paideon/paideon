import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ActivateDto } from "./dto/activate.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtPayload } from "./types/jwt-payload.type";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/activate
  // ─────────────────────────────────────────────────────────────
  // User enters their school email to request an activation link.
  // Always returns 200 regardless of whether email exists.

  @Post("activate")
  @HttpCode(HttpStatus.OK)
  async requestActivation(@Body("email") email: string) {
    await this.authService.requestActivation(email);
    return {
      message:
        "If this email is registered, you will receive an activation link.",
    };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/activate/confirm
  // ─────────────────────────────────────────────────────────────
  // User clicked activation link and submitted their password.
  // On success: auto-login — sets cookie and returns access token.

  @Post("activate/confirm")
  async confirmActivation(
    @Body() dto: ActivateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.confirmActivation(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/login
  // ─────────────────────────────────────────────────────────────

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/refresh
  // ─────────────────────────────────────────────────────────────
  // Called silently by the portal every 15 minutes.
  // JwtRefreshGuard reads the httpOnly cookie and validates it.
  // Returns a new access token and rotates the refresh token.

  @Post("refresh")
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

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async logout(
    @CurrentUser() user: JwtPayload & { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.refreshToken);
    this.clearRefreshCookie(res);
    return { message: "Logged out successfully." };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/forgot-password
  // ─────────────────────────────────────────────────────────────

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return {
      message: "If this email is registered, you will receive a reset link.",
    };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/auth/reset-password
  // ─────────────────────────────────────────────────────────────

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return {
      message: "Password updated. Please log in with your new password.",
    };
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────

  // Sets the refresh token as an httpOnly cookie on the response.
  // The cookie attributes match our security policy exactly.

  private setRefreshCookie(res: Response, token: string) {
    res.cookie("refresh_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  // Clears the refresh token cookie on logout.

  private clearRefreshCookie(res: Response) {
    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }
}
