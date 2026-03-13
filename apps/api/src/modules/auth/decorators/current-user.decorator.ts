// current-user.decorator.ts

import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";

export const CurrentUser = createParamDecorator(
  // The first argument (_data) is what people pass inside @CurrentUser(someValue)
  // We ignore it → our decorator doesn't take any argument

  (_data: unknown, context: ExecutionContext): JwtPayload => {
    // Get the raw HTTP request object from NestJS execution context
    const request = context.switchToHttp().getRequest();

    // If @CurrentUser() use on a route that has no auth guard, this throw a clear error immediately.
    if (!request.user) {
      throw new UnauthorizedException("No authenticated user found");
    }

    // Return whatever Passport put in req.user
    // (which is the object returned from validate() in jwt.strategy / jwt-refresh.strategy)
    return request.user;
  },
);
