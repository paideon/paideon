// packages/tokens/src/primitives/motion.ts
//
// Source: design-system doc §8. Philosophy: "purposeful restraint" — motion
// communicates hierarchy and state change, never decorative for its own sake.
// Anti-pattern: animations over 500ms in standard UI interactions.

export const transitionDuration = {
  instant: "80ms", // hover state fills
  fast: "120ms", // button press feedback
  normal: "200ms", // panel transitions, dropdown open
  slow: "300ms", // modal entry, page transitions
  deliberate: "500ms", // achievement reveals, progress fills — ceiling
} satisfies Record<string, string>;

export const transitionTimingFunction = {
  standard: "cubic-bezier(0.4, 0.0, 0.2, 1)", // most UI motion
  enter: "cubic-bezier(0.0, 0.0, 0.2, 1)", // elements entering
  exit: "cubic-bezier(0.4, 0.0, 1, 1)", // elements leaving
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // achievement reveals only
} satisfies Record<string, string>;

// Achievement reveal pattern (design-system §8.2), encoded as reusable
// duration/easing pairs rather than a single hardcoded animation, so
// components compose it: scale(0.7→1) + opacity 0→1 using deliberate/spring,
// followed by a 200ms pulse glow on the gold border.
export const achievementReveal = {
  scaleFrom: "0.7",
  duration: transitionDuration.deliberate,
  easing: transitionTimingFunction.spring,
  pulseGlowDuration: "200ms",
} as const;
