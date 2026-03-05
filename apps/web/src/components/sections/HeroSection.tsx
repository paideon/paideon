'use client';

import { motion } from 'framer-motion';

// Each letter: scaleY drives the dramatic height variation
const LETTERS = [
  { char: 'N', scaleY: 0.72 },
  { char: 'E', scaleY: 1.1 },
  { char: 'X', scaleY: 0.88 },
  { char: 'U', scaleY: 1.35 },
  { char: 'S', scaleY: 1.0 },
];

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      {/* GIANT variable-height NEXUS — tops aligned, bottoms ragged  */}
      <div
        className="absolute inset-0 flex items-start justify-center pointer-events-none overflow-hidden mb-8"
        style={{ paddingTop: '0px' }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-start uppercase leading-none whitespace-nowrap select-none"
          style={{
            fontFamily: '"Arial Black", "Haettenschweiler", Impact, sans-serif',
            fontSize: 'clamp(100px, 26vw, 380px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'text-foreground',
            lineHeight: 1,
          }}
        >
          {LETTERS.map((l, i) => (
            <motion.span
              key={i}
              className="inline-block origin-top"
              style={{
                display: 'inline-block',
                lineHeight: 0.85,
              }}
              initial={{ scaleY: 0, scaleX: 0.9 }}
              animate={{ scaleY: l.scaleY, scaleX: 0.9 }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {l.char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/*  Centered Logo  */}

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mt-56">
        <motion.div
          initial={{ opacity: 0, y: 100, filter: 'blur(4px)', scale: 0.8 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center"
        >
          <img
            src="/nexus_logo.svg"
            alt="NEXUS logo"
            width={500}
            height={500}
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
      </div>

      {/*  Scroll Indicator  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="font-mono text-label tracking-[0.3em] text-subtle uppercase">
          Scroll
        </span>
        {/* Animated scroll line */}
        <div className="relative w-px h-12 bg-border overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-gold to-transparent"
            style={{ height: '40%' }}
            animate={{ y: ['0%', '250%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.4,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
