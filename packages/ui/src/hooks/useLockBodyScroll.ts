'use client';

import { useEffect } from 'react';

// Module-level counter so multiple simultaneously-open overlays (e.g. a
// Modal opened from within the mobile nav drawer) don't stomp on each
// other's cleanup. Each hook instance increments on lock and decrements on
// unlock/unmount; the body scroll is only restored once the count reaches 0.
let lockCount = 0;
let previousOverflow = '';

function lock() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

/**
 * Locks body scroll while `active` is true. Safe to use from multiple
 * components at once (Modal, mobile nav drawer, Lightbox, etc.) — scroll is
 * only restored once every consumer has released its lock.
 */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return () => unlock();
  }, [active]);
}
