'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // ── Progress bar fills over 5 seconds ─────────────────────────
  useEffect(() => {
    const duration = 5000;
    const interval = 16; // ~60fps
    const step = (interval / duration) * 100;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      setProgress(Math.min(current, 100));
      if (current >= 100) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // ── Dismiss after 5 seconds ────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9998] bg-[#0e1117] flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            {/* Replace this with your actual <Image> logo */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="47"
                height="47"
                stroke="#3d4659"
                strokeWidth="0.8"
              />
              <rect
                x="8.5"
                y="8.5"
                width="31"
                height="31"
                stroke="#3d4659"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <circle
                cx="24"
                cy="24"
                r="7"
                stroke="#4e7c6f"
                strokeWidth="0.8"
              />
              <line
                x1="24"
                y1="0"
                x2="24"
                y2="17"
                stroke="#3d4659"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="24"
                y1="31"
                x2="24"
                y2="48"
                stroke="#3d4659"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="24"
                x2="17"
                y2="24"
                stroke="#3d4659"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line
                x1="31"
                y1="24"
                x2="48"
                y2="24"
                stroke="#3d4659"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <circle cx="24" cy="24" r="2" fill="#4e7c6f" />
            </svg>

            {/* paideon letters staggered in */}
            <div className="flex gap-[0.06em]">
              {'paideon'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display text-4xl font-light tracking-[0.15em] text-transparent"
                  style={{ WebkitTextStroke: '1px #3d4659' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="font-mono text-[9px] tracking-[0.3em] text-foreground-subtle uppercase"
            >
              C.W.W. Kannangara Central College
            </motion.span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3"
          >
            <div className="w-full h-px bg-white/[0.06]">
              <motion.div
                className="h-full bg-primary/60"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-foreground-subtle uppercase">
              {Math.floor(progress)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
