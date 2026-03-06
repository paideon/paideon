// The `RevealText` component — each line of the text is individually masked. The text sits inside an `overflow-hidden` container and slides up from below the clip boundary. The effect is like a theater curtain rising line by line. Each line reveals independently giving the text a sense of being written in real time.

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function RevealText({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
