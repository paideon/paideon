"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { SchoolLogo } from "../icons/brand/SchoolLogo";

export interface LoadingScreenProps {
  /** Control visibility externally — fade out when content is ready */
  visible?: boolean;
  /** Called after the exit animation completes */
  onExited?: () => void;
  ariaLabel?: string;
}

export function LoadingScreen({
  visible = true,
  onExited,
  ariaLabel = "Loading",
}: LoadingScreenProps) {
  const [exitComplete, setExitComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible && exitComplete) {
      onExited?.();
      setExitComplete(false);
    }
  }, [visible, exitComplete, onExited]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label={ariaLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-green-base flex items-center justify-center"
          onAnimationComplete={(definition) => {
            if (definition === "exit") setExitComplete(true);
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-radial-gold"
              animate={
                shouldReduceMotion
                  ? { opacity: 0.3, scale: 1 }
                  : {
                      opacity: [0.4, 1, 0.4],
                      scale: [0.95, 1.05, 0.95],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Crest with shine overlay */}
            <div className="relative">
              <SchoolLogo variant="crest-only" size="lg" />

              {/* Shine sweep */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-full pointer-events-none w-[40%] h-full bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-gold-light)_50%,transparent),transparent)]"
                  aria-hidden="true"
                  initial={{ x: "-200%", skewX: -20, opacity: 0 }}
                  animate={{
                    x: ["-200%", "200%"],
                    skewX: -20,
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                    times: [0, 0.2, 1],
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
