// reset-password.dto.ts
//
// Validates the body of POST /api/auth/reset-password
// Submitted when the user sets a new password via the reset link.

import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class ResetPasswordDto {
  // The raw reset token from the email link
  @IsString()
  @IsNotEmpty()
  token!: string;

  // Same password requirements as activation
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_-])/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
