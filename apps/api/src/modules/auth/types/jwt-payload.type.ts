// jwt-payload.type.ts

// Defines the shape of the data encoded inside every JWT access token AND refresh token.

// KEEP IT MINIMAL — JWT is not encrypted. Anyone who steals the token can read it.

import { Role } from '@paideon/database/generated/client/client';

export type JwtPayload = {
  // The user's primary key (CUID) — used everywhere to fetch the full user record
  sub: string;

  // Which school this user belongs to — used by SchoolGuard on EVERY request
  schoolId: string;

  // The kind of person (student, teacher, ...). It is NOT what they may do:
  // that comes from their roles and grants (AccessService.capabilitiesFor).
  role: Role;

  // Human-readable ID for logging, audit trails, and display
  paideonId: string;
};
