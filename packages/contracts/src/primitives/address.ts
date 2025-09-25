// packages/contracts/src/primitives/address.ts

// Physical address contract. Reused across contact info (domains/contact)
// and facility locations (domains/facilities) — lives in primitives/ rather
// than either domain because tier-4 siblings can't import each other.
//

import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  postalCode: z.string().optional(),
  country: z.string().min(1),
});

export type AddressData = z.infer<typeof AddressSchema>;
