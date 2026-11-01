// GET /api/auth/sessions: where a person is signed in.
//
// A "session" is one active refresh token. The token is replaced every time
// the portal renews its access token, so `lastActiveAt` is when this session
// last renewed (roughly: last time a page of it was open).

import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.string(),
  lastActiveAt: z.string(),
  expiresAt: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  /** The session making this request. */
  current: z.boolean(),
});

export type SessionData = z.infer<typeof SessionSchema>;

export const SessionsSchema = z.array(SessionSchema);

export type SessionsData = z.infer<typeof SessionsSchema>;
