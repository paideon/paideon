// jwt-payload.type.ts
//
// Defines the shape of the data encoded inside every JWT access token.
// This type is used in two places:
//   1. When CREATING a token → auth.service.ts signs this payload
//   2. When READING a token  → jwt.strategy.ts decodes and validates this
//
// Keep this minimal. A JWT payload is readable by anyone who has the token
// (it is signed, not encrypted). Never include sensitive data here.

import { Role } from "@prisma/client";

export type JwtPayload = {
  // The user's CUID — used to look up the user in the database
  sub: string;

  // The school this user belongs to — used by SchoolGuard on every request
  // to ensure the user can only access their own school's data
  schoolId: string;

  // The user's role — used by RolesGuard to check endpoint permissions
  role: Role;

  // The human-readable ID — used for display and audit log entries
  paideonId: string;
};
