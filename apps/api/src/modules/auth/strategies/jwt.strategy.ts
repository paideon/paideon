// jwt.strategy.ts

// Teaches Passport how to validate an ACCESS TOKEN.

// This runs automatically on every route protected by JwtAuthGuard.
// You never call this directly.

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      // Where to find the token? => Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If the token is expired → Passport rejects it automatically.
      ignoreExpiration: false,

      // Must match the secret used to singing in auth.service.ts.
      // Loaded from .env — never hardcoded.
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  // validate() is called by Passport after the token is verified.
  // Whatever you return here becomes available as req.user in any route handler that uses JwtAuthGuard.
  async validate(payload: JwtPayload) {
    if (
      !payload.sub ||
      !payload.schoolId ||
      !payload.libraryId ||
      !payload.role
    ) {
      throw new UnauthorizedException("Invalid token payload");
    }
    return payload;
  }
}
