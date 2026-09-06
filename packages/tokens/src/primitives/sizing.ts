// packages/tokens/src/primitives/sizing.ts
//
// Source: design-system doc §7.2 (icons), §9.1 (layout grid), §6.4 (nav),
// §6.1/§7.3 (touch targets).

export const iconSize = {
  xs: "14px", // inline text icons
  sm: "16px", // badge icons, tight UI
  md: "20px", // navigation, button icons
  lg: "24px", // card headers, section icons
  xl: "32px", // feature highlights
  "2xl": "48px", // empty states, illustrations
} satisfies Record<string, string>;

export const iconStroke = {
  default: "1.5px",
  emphasis: "2px",
} satisfies Record<string, string>;

// Minimum interactive touch target — WCAG 2.5.5. Non-negotiable per the
// component system doc: "Icon buttons must maintain a minimum 40×40px
// touch target."
export const touchTarget = {
  min: "40px",
} satisfies Record<string, string>;

export const layout = {
  "sidebar-expanded": "256px",
  "sidebar-collapsed": "64px",
  "content-max-width": "1280px",
  "content-padding-desktop": "32px",
  "content-padding-tablet": "20px",
  "content-padding-mobile": "16px",
  "nav-item-height": "44px",
  "nav-sub-item-height": "36px",
} satisfies Record<string, string>;

// Column grid — design-system doc §9.1. Consumed by the generators as
// metadata (Tailwind's own breakpoint system handles the actual grid-column
// count via className composition in components, not a raw CSS token).
export const grid = {
  "desktop-columns": "12",
  "desktop-gutter": "24px",
  "tablet-columns": "8",
  "tablet-gutter": "20px",
  "mobile-columns": "4",
  "mobile-gutter": "16px",
} satisfies Record<string, string>;

// Data table row heights — component system doc §6.5
export const tableRow = {
  compact: "40px",
  default: "48px",
  comfortable: "56px",
} satisfies Record<string, string>;
