// activate.dto.ts
//
// Validates the body of POST /api/auth/activate/confirm
// This is submitted when the user clicks their activation link
// and sets their password for the first time.

import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class ActivateDto {
  // The raw activation token from the email link
  @IsString()
  @IsNotEmpty()
  token!: string;

  // Password requirements match our security policy exactly.
  // See docs/security/security-architecture.md Section 4.
  //
  // @Matches checks:
  //   (?=.*[A-Z])  → at least one uppercase letter
  //   (?=.*[a-z])  → at least one lowercase letter
  //   (?=.*\d)     → at least one number
  //   (?=.*[!@#$%^&*_-]) → at least one special character
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt silently truncates at 72 characters
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_-])/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password!: string;

  // Must match the password field — checked in the service
  // (DTOs cannot compare two fields against each other)
  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
