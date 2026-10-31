'use client';

import type { ReactNode } from 'react';
import type { CapabilityEnumData } from '@paideon/contracts';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { can } from '@/lib/capabilities';

import { ForbiddenState } from './ForbiddenState';

type Props = {
  capability: CapabilityEnumData;
  scope?: string;
  children: ReactNode;
};

/**
 * Route guard: wrap a page's content and anyone without the capability sees
 * the 403 message instead. This only spares people a broken page; the API
 * refuses the data on its own.
 */
export function RequireCapability({ capability, scope, children }: Props) {
  const user = useCurrentUser();
  return can(user, capability, scope) ? <>{children}</> : <ForbiddenState />;
}
