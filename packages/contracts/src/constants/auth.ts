// Auth limits shared by the API (validation) and the portal (forms).
// Change a number here and both sides follow.

// Longest valid email address (RFC 5321).
export const EMAIL_MAX_LENGTH = 254;

export const PASSWORD_MIN_LENGTH = 8;

// bcrypt reads only the first 72 BYTES of a password and silently ignores
// the rest. In UTF-8 an English letter is 1 byte but a Sinhala or Tamil
// letter is 3 bytes, so the limit is counted in bytes, not characters.
export const PASSWORD_MAX_BYTES = 72;

// At login we only stop absurdly large input from reaching bcrypt. The byte
// limit above is NOT applied here, so an existing account can never be locked
// out by a rule that did not exist when its password was set.
export const LOGIN_PASSWORD_MAX_LENGTH = 128;
