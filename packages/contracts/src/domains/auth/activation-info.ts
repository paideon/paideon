// Response of GET /api/auth/activate/:token. Lets the activation page show
// whose account is being activated before the person chooses a password.
// Looking a token up does NOT use it up.

import { z } from 'zod';

export const ActivationInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export type ActivationInfoData = z.infer<typeof ActivationInfoSchema>;
