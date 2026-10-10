// hooks/useInView.ts
'use client';
import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Root margin – same as IntersectionObserver API */
  rootMargin?: string;
  /** Threshold (0–1) – same as IntersectionObserver API */
  threshold?: number;
  /** Whether to trigger only once (disconnects after first intersection) */
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLElement>({
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        if (inView && triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isInView };
}
