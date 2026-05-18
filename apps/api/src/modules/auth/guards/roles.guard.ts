// roles.guard.ts

// This guard is the ENFORCER that pairs with roles.decorator.ts.
// roles.decorator.ts labels a route with required roles.
// This guard reads that label and decides: allow or block.

// How to use both together on a route:
//   @UseGuards(JwtAuthGuard, RolesGuard)  ← attach the guards
//   @Roles(Role.ADMIN)                    ← set the required role(s)
//   @Get('admin-only-route')
//   someMethod() { ... }

// IMPORTANT: JwtAuthGuard must run BEFORE RolesGuard.
// JwtAuthGuard puts the user into request.user.
// RolesGuard reads from request.user.
// Wrong order → request.user is empty → guard crashes.

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

// The same key used in roles.decorator.ts to store the metadata.
// Both files must use the exact same string — ideally import this
// from a shared constants file to avoid silent mismatches.
const ROLES_KEY = "roles";

// @Injectable() means NestJS can create and manage this class automatically.
// CanActivate is a NestJS interface — it forces you to implement canActivate(),
// which must return true (allow) or false (block).

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector is a NestJS utility for reading metadata.
  // It is injected automatically because of @Injectable() above.
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Step 1 — read the @Roles() metadata attached to this route.
    // getAllAndOverride checks the method first, then the class.
    // This means a method-level @Roles() overrides a class-level one.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // the specific method e.g. getUsers()
      context.getClass(), // the whole controller class e.g. UsersController
    ]);

    // Step 2 — if no @Roles() decorator was used on this route at all,
    // the route is considered public (role-wise) → let everyone through.
    if (!requiredRoles) {
      return true;
    }

    // Step 3 — get the logged-in user from the request.
    // This was placed here by JwtAuthGuard → jwt.strategy.ts → validate().
    // If JwtAuthGuard didn't run first, request.user will be undefined here.
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Step 4 — check if the user's single role is in the allowed list.
    // Returns true  → NestJS lets the request through to the controller.
    // Returns false → NestJS automatically throws 403 Forbidden.
    return requiredRoles.includes(user.role);
  }
}
