// packages/tokens/src/primitives/shadows.ts
//
// Source: design-system doc §5.2. Warm-tinted shadows (rgba against Ink
// #0E1117), never neutral grey — keeps palette coherence in light mode.
//
// IMPORTANT: these are the LIGHT-MODE elevation mechanism only. In dark
// mode, shadows are invisible against dark surfaces — dark mode elevation
// is achieved entirely through semantic/elevation.ts (layered surface tones
// + explicit borders). Do not reach for boxShadow tokens to elevate a
// dark-mode card; see semantic/elevation.ts.
//
// Focus rings are the one exception: they remain shadow-based in BOTH
// themes because they must render above any surface.

export const boxShadow = {
  xs: "0 1px 2px rgba(14,17,23,0.06)",
  sm: "0 1px 4px rgba(14,17,23,0.08), 0 1px 2px rgba(14,17,23,0.04)",
  md: "0 4px 12px rgba(14,17,23,0.10), 0 2px 4px rgba(14,17,23,0.06)",
  lg: "0 8px 24px rgba(14,17,23,0.12), 0 4px 8px rgba(14,17,23,0.08)",
  xl: "0 16px 48px rgba(14,17,23,0.16), 0 8px 16px rgba(14,17,23,0.10)",
  // Focus rings — WCAG 2.4.7 compliance. Used in both light and dark mode.
  focus: "0 0 0 3px rgba(78,124,111,0.40)", // sage
  "focus-danger": "0 0 0 3px rgba(192,84,77,0.35)",
} satisfies Record<string, string>;
