// packages/tokens/src/primitives/effects.ts
//
// Source: design-system doc §9.2 (z-index), §6.1 (disabled opacity).
// Anti-pattern: "Z-index values outside the defined scale (no arbitrary
// z-index: 9999)."

export const zIndex = {
  base: "0",
  raised: "10", // floating labels, tooltips on flat surfaces
  dropdown: "100",
  sticky: "200", // sticky headers, table columns
  overlay: "300", // side drawers, panels
  modal: "400",
  toast: "500",
  tooltip: "600", // tooltips over modals
} satisfies Record<string, string>;

export const opacity = {
  disabled: "0.45", // component system §6.1 — disabled buttons use opacity, never a different color
} satisfies Record<string, string>;
