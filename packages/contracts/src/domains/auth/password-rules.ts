// The rules a NEW password must follow, as data, so the portal can show a
// live checklist while the person types.
//
// These mirror `newPasswordField` in auth-requests.ts. password-rules.spec.ts
// checks that the two never disagree, so change both together.

import {
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_LENGTH,
} from '../../constants/index.ts';

const utf8 = new TextEncoder();

export type PasswordRule = {
  id: 'length' | 'uppercase' | 'lowercase' | 'number' | 'special' | 'bytes';
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'uppercase',
    label: 'An uppercase letter',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'A lowercase letter',
    test: (p) => /[a-z]/.test(p),
  },
  { id: 'number', label: 'A number', test: (p) => /\d/.test(p) },
  {
    id: 'special',
    label: 'A special character (!@#$%^&*_-)',
    test: (p) => /[!@#$%^&*_-]/.test(p),
  },
  {
    id: 'bytes',
    label: `Not too long (at most ${PASSWORD_MAX_BYTES} bytes)`,
    test: (p) => utf8.encode(p).length <= PASSWORD_MAX_BYTES,
  },
];
