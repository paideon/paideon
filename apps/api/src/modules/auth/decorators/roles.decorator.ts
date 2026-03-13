// roles.decorator.ts

// A custom METHOD decorator that labels a route with the roles allowed to access it.
// By itself it does nothing — it just attaches metadata.
// The actual enforcement happens in roles.guard.ts which reads this metadata.

// Usage example:
//   @Roles(Role.ADMIN)              → only admins
//   @Roles(Role.ADMIN, Role.LIBRARIAN) → admins OR librarians

import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

// "roles" is the key we use to store and later retrieve this metadata.
// roles.guard.ts uses this exact same string "roles" to read it back.
const ROLES_KEY = "roles";

// (...roles: Role[]) means accept one or more Role values as arguments.
// SetMetadata attaches them invisibly to whatever route this decorator is placed on.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
