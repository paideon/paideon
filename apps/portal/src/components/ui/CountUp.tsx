// // Number with scramble
// <CountUp target={8500} />

// // Number with suffix
// <CountUp target={98} suffix="%" />

// // String — no animation, just displays
// <CountUp target="24/7" />

// // Custom duration
// <CountUp target={4198} duration={2400} />

// // Without scramble if you prefer clean count
// <CountUp target={8500} scramble={false} />

'use client';

import { useRef, useState, useEffect } from 'react';

interface CountUpProps {
  target: number | string;
  suffix?: string;
  duration?: number;
  scramble?: boolean;
}

export function CountUp({
  target,
  suffix = '',
  duration = 1800,
  scramble = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>('0');
  const [started, setStarted] = useState(false);

  // Characters used during scramble phase
  const SCRAMBLE_CHARS = '0123456789';

  // Start counting only when element enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // If target is a string (like '24/7') just display it directly
    if (typeof target === 'string') {
      setDisplay(target);
      return;
    }

    if (!started) return;

    let animationFrame: number;
    let scrambleInterval: ReturnType<typeof setInterval>;

    const startTime = performance.now();

    // Phase 1 — scramble random digits for the first 30% of duration
    if (scramble) {
      const scrambleDuration = duration * 0.3;
      scrambleInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        if (elapsed >= scrambleDuration) {
          clearInterval(scrambleInterval);
          return;
        }

        // Generate random number in same digit range as target
        const digits = String(target).length;
        const randomNum = Math.floor(Math.random() * Math.pow(10, digits));
        setDisplay(randomNum.toLocaleString());
      }, 50);
    }

    // Phase 2 — smooth count up using eased progress
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const scrambleDuration = scramble ? duration * 0.3 : 0;

      // Wait for scramble phase to finish
      if (elapsed < scrambleDuration) {
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      // Count up progress after scramble
      const countElapsed = elapsed - scrambleDuration;
      const countDuration = duration - scrambleDuration;
      const progress = Math.min(countElapsed / countDuration, 1);

      // Ease out cubic — fast at start, slow at end (like a slot machine settling)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * (target as number));

      setDisplay(current.toLocaleString());

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        // Snap to exact final value
        setDisplay((target as number).toLocaleString());
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(scrambleInterval);
    };
  }, [started, target, duration, scramble]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
