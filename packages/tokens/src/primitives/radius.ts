// packages/tokens/src/primitives/radius.ts
//
// Source: design-system doc §5.1. 8px is the deliberate signature value —
// "sits at the precise intersection: organized, approachable, institutional."
// Rule: --radius-md (8px) must be applied consistently to all interactive
// elements. Inconsistent radius usage is the most immediately detectable
// sign of a design system breaking down.

export const borderRadius = {
  none: "0px",
  sm: "4px", // badges, tags, inline chips
  md: "8px", // PRIMARY — cards, buttons, inputs
  lg: "12px", // modals, drawers, large panels
  xl: "16px", // feature cards, hero elements — ceiling; never go higher on institutional UI
  full: "9999px", // avatars, toggle switches, pill labels
} satisfies Record<string, string>;
