// packages/tokens/src/primitives/spacing.ts
//
// Base-4 spacing grid. Source: brand/design-system-&-visual-identity.md §4.
// "All spacing values are multiples of 4px ... creates visual rhythm without
// the awkward fractions introduced by base-8 or base-5 grids."
//
// This is the exact step set documented in the brand doc — not a continuous
// 1-96 scale. Extend deliberately (in matching 4px increments) if a component
// genuinely needs an intermediate step; don't silently interpolate.

export const spacing = {
  "0": "0px",
  "space-1": "4px",
  "space-2": "8px",
  "space-3": "12px",
  "space-4": "16px", // base unit — standard component padding
  "space-5": "20px",
  "space-6": "24px", // section internal padding
  "space-7": "28px",
  "space-8": "32px", // card padding
  "space-10": "40px", // section gaps
  "space-12": "48px", // large section spacing
  "space-16": "64px", // hero / page-level spacing
  "space-20": "80px",
  "space-24": "96px", // section breaks
} satisfies Record<string, string>;
