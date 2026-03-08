// login.dto.ts
//
// Validates the body of POST /api/auth/login
// The identifier can be either a paideonId (KCCM-STU-04198)
// or a school email (john@cwwkcc.lk) — the service figures out which.

import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  // Either paideonId or school email
  // @IsString → must be a string, not a number or object
  // @IsNotEmpty → cannot be an empty string
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  // @MinLength(8) → rejects obviously invalid attempts early
  // without revealing whether the account exists
  @IsString()
  @MinLength(8)
  password!: string;
}
