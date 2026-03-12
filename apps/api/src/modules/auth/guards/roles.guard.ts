import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Step 1 — what roles does this route require?
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    // Step 2 — no @Roles() on this route → allow everyone
    if (!requiredRoles) {
      return true;
    }

    // Step 3 — get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Step 4 — check if user's role is in the allowed list
    return requiredRoles.includes(user.role);
  }
}
