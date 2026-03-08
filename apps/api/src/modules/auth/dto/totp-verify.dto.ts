// totp-verify.dto.ts
//
// Validates the body of POST /api/auth/2fa/verify
// The 6-digit code the user reads from their authenticator app.

import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class TotpVerifyDto {
  // TOTP codes are always exactly 6 digits.
  // @Length(6, 6) → must be exactly 6 characters
  // @Matches(/^\d+$/) → must be digits only (no letters, no spaces)
  // Backup codes are handled separately — they have a different format
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d+$/, { message: "Code must contain digits only" })
  code!: string;
}
