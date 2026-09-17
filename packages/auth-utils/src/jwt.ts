import jwt, {
  type JwtPayload,
  type SignOptions,
  type Secret,
} from "jsonwebtoken";

export type AuthJwtPayload = JwtPayload & {
  sub?: string;
  userId?: string;
  role?: string;
  schoolId?: string;
  paideonId?: string;
};

export function signJwt(
  payload: AuthJwtPayload,
  secret: Secret,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, secret, options);
}

export function verifyJwt<T extends AuthJwtPayload = AuthJwtPayload>(
  token: string,
  secret: Secret
): T {
  return jwt.verify(token, secret) as T;
}
