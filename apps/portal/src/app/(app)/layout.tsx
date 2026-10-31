import type { ReactNode } from 'react';

import { AppFrame } from '@/components/common/AppFrame';

// Every page in this group is for signed-in people: one frame, one auth check.
export default function SignedInLayout({ children }: { children: ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
