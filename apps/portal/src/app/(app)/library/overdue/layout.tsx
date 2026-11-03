'use client';

import type { ReactNode } from 'react';

import { RequireCapability } from '@/components/common/RequireCapability';

// Anyone without the capability sees the 403 message instead of the page.
// The API refuses the data on its own as well.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireCapability capability="library.reports">
      {children}
    </RequireCapability>
  );
}
