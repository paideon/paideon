// packages/tokens/src/primitives/motion.ts

export const transitionDuration = {
  instant: '80ms',
  fast: '150ms',
  standard: '300ms',
  gentle: '500ms',
  slow: '800ms',
  ceremonial: '1200ms',
  epic: '2400ms',
} as const;

export const transitionTimingFunction = {
  snap: 'cubic-bezier(0.25, 0, 0, 1)',
  out: 'cubic-bezier(0.0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  ceremonial: 'cubic-bezier(0.16, 1, 0.3, 1)',
  ember: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} satisfies Record<string, string>;
