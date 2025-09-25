// packages/contracts/src/system/auth/session.ts

// An active login session.

import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
});

export type SessionData = z.infer<typeof SessionSchema>;
