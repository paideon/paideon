// packages/contracts/src/registry/globals/navigation.ts

import { z } from 'zod';

import type { PageSection } from '../types.ts';

export interface NavLinkData {
  id: string;
  label: string;
  href: string;
  children?: NavLinkData[];
}

// z.lazy is required here because NavLinkSchema references itself (children).
export const NavLinkSchema: z.ZodType<NavLinkData> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    href: z.string(),
    children: z.array(NavLinkSchema).optional(),
  }),
);

export const NavigationContentSchema = z.object({
  links: z.array(NavLinkSchema),
});
export type NavigationContentData = z.infer<typeof NavigationContentSchema>;

export const navigationSection: PageSection = {
  key: 'global.navigation',
  blockKey: 'navigation',
  label: 'Navigation',
  description: 'Primary site navigation links, including nested submenus.',
  schema: NavigationContentSchema,
};
