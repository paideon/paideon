// forgot-password.dto.ts
//
// Validates the body of POST /api/auth/forgot-password
// User enters their school email to request a reset link.

import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  // @IsEmail → validates proper email format
  // Rejects obviously malformed input before it reaches the service
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
