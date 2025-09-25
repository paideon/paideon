'use client';

import { useEffect, useState, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastYRef.current;

      if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 ? 'down' : 'up');
        lastYRef.current = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return direction;
}
