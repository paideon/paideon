// jwt-refresh.strategy.ts

// Teaches Passport how to validate a REFRESH TOKEN.

// Key differences from JwtStrategy:
//   1. Extracts token from httpOnly COOKIE (not Authorization header)
//      JavaScript cannot read httpOnly cookies — Passport reads it
//      directly from the raw request headers
//   2. Uses JWT_REFRESH_SECRET (different secret from access tokens)
//   3. The raw token is passed to validate() so we can:
//      → Hash it with SHA-256
//      → Check it exists in the database (not revoked)

// This runs automatically on POST /auth/refresh and POST /auth/logout
// via JwtRefreshGuard.

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh", // name must match what JwtRefreshGuard uses
) {
  constructor(config: ConfigService) {
    super({
      // Extract the refresh token from the httpOnly cookie.
      // The cookie name must match what we set in auth.service.ts.
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.["refresh_token"];
          if (!token) return null;
          return token;
        },
      ]),

      ignoreExpiration: false,

      // Different secret from access tokens.
      // If both used the same secret, a refresh token could be
      // used as an access token and vice versa.
      secretOrKey: config.get<string>("JWT_REFRESH_SECRET")!,

      // passReqToCallback: true means the raw Request object
      // is passed as the first argument to validate().
      // We need this to extract the raw token string
      // so we can hash it and check it in the database.
      passReqToCallback: true,
    });
  }

  // Called by Passport after the token signature is verified.
  // req      → the raw Express request (contains the cookie)
  // payload  → the decoded JWT payload

  // We return both the payload AND the raw token.
  // The raw token is needed in auth.service.ts to:
  //   → Hash it with SHA-256
  //   → Find the matching RefreshToken record in the database
  //   → Verify it has not been revoked
  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.cookies?.["refresh_token"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    if (!payload.sub || !payload.schoolId || !payload.role) {
      throw new UnauthorizedException("Invalid token payload");
    }

    // Return payload + raw token together.
    // This becomes req.user in the refresh route handler.
    return {
      ...payload,
      refreshToken,
    };
  }
}
