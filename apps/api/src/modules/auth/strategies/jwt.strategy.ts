// jwt.strategy.ts
//
// Teaches Passport how to validate an ACCESS TOKEN.
//
// When a request comes in with:
//   Authorization: Bearer eyJhbGci...
//
// This strategy:
//   1. Extracts the token from the Authorization header
//   2. Verifies the signature using JWT_SECRET
//   3. Checks the token has not expired
//   4. Returns the payload — which becomes req.user
//
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
      // Tell Passport WHERE to find the token in the request.
      // fromAuthHeaderAsBearerToken() looks for:
      //   Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If the token is expired → Passport rejects it automatically.
      // We do not need to check expiry manually.
      ignoreExpiration: false,

      // The secret used to VERIFY the token signature.
      // Must match the secret used to SIGN it in auth.service.ts.
      // Loaded from .env — never hardcoded.
      secretOrKey: config.get<string>("JWT_SECRET")!,
    });
  }

  // validate() is called by Passport after the token is verified.
  // Whatever you return here becomes available as req.user
  // in any route handler that uses JwtAuthGuard.
  //
  // We return the full payload so guards and decorators
  // can access userId, schoolId, role, and paideonId.
  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.schoolId || !payload.role) {
      throw new UnauthorizedException("Invalid token payload");
    }
    return payload;
  }
}
