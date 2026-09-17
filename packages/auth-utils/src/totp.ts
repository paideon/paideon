import * as OTPAuth from "otpauth";

export function generateTotpSecret(label: string, issuer: string): string {
  const secret = new OTPAuth.Secret({ size: 32 });
  const totp = new OTPAuth.TOTP({
    issuer,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  return totp.secret.base32;
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    issuer: "Paideon",
    label: "Paideon",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });

  return totp.validate({ token: code }) !== null;
}
