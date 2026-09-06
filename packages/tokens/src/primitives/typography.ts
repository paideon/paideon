// packages/tokens/src/primitives/typography.ts
//
// Source: brand/design-system-&-visual-identity.md §3, design/paideon-ui-designer-guide.md Part 3.
//
// Three fonts, three jobs — they do not cross over (see designer guide §3.1):
//   Cormorant Garamond → academic/reading contexts. "Slow down."
//   Inter              → everything functional. 95% of the UI.
//   Ubuntu             → marketing/onboarding surfaces ONLY. Never functional UI.

// =============================================================================
// Font Families
// =============================================================================
export const fontFamily = {
  display: ["Cormorant Garamond", "Georgia", "serif"],
  sans: ["Inter", "SF Pro Text", "system-ui", "sans-serif"],
  brand: ["Ubuntu", "Trebuchet MS", "sans-serif"],
  mono: ["Inter Mono", "JetBrains Mono", "Fira Code", "monospace"],
} satisfies Record<string, string[]>;

// =============================================================================
// Font Weights
// =============================================================================
export const fontWeight = {
  light: "300", // supplementary captions only — never below 16px
  regular: "400", // body copy, form inputs
  medium: "500", // UI labels, nav items
  semibold: "600", // sub-headings, card titles
  bold: "700", // page headings, CTAs
  extrabold: "800", // hero text, display emphasis
} satisfies Record<string, string>;

// =============================================================================
// Type Scale
// =============================================================================
// NOTE on dark mode: Cormorant Garamond's thin strokes fade against Ink below
// 30px. display-md (30px) is the floor for Cormorant in dark contexts — below
// that, fall back to Inter Bold. This is a *usage* rule (see semantic/text.ts
// / component docs), not encoded in the raw size here.
export const fontSize = {
  // Display — Cormorant Garamond
  "display-xl": [
    "48px",
    { lineHeight: "1.1", fontWeight: fontWeight.bold, family: "display" },
  ],
  "display-lg": [
    "38px",
    { lineHeight: "1.2", fontWeight: fontWeight.semibold, family: "display" },
  ],
  "display-md": [
    "30px",
    { lineHeight: "1.25", fontWeight: fontWeight.semibold, family: "display" },
  ],

  // Headings — Inter
  "heading-xl": [
    "28px",
    { lineHeight: "1.3", fontWeight: fontWeight.bold, family: "sans" },
  ],
  "heading-lg": [
    "22px",
    { lineHeight: "1.3", fontWeight: fontWeight.semibold, family: "sans" },
  ],
  "heading-md": [
    "18px",
    { lineHeight: "1.4", fontWeight: fontWeight.semibold, family: "sans" },
  ],
  "heading-sm": [
    "15px",
    { lineHeight: "1.4", fontWeight: fontWeight.semibold, family: "sans" },
  ],

  // Body — Inter
  "body-lg": [
    "17px",
    { lineHeight: "1.7", fontWeight: fontWeight.regular, family: "sans" },
  ], // reading mode
  "body-md": [
    "15px",
    { lineHeight: "1.6", fontWeight: fontWeight.regular, family: "sans" },
  ], // standard UI
  "body-sm": [
    "13px",
    { lineHeight: "1.5", fontWeight: fontWeight.regular, family: "sans" },
  ],

  // UI elements — Inter
  label: [
    "12px",
    { lineHeight: "1.3", fontWeight: fontWeight.medium, family: "sans" },
  ],
  caption: [
    "11px",
    { lineHeight: "1.3", fontWeight: fontWeight.regular, family: "sans" },
  ],
  mono: [
    "13px",
    { lineHeight: "1.5", fontWeight: fontWeight.regular, family: "mono" },
  ],
} satisfies Record<
  string,
  [string, { lineHeight: string; fontWeight: string; family: string }]
>;

// Standalone letter-spacing — only used on ALL CAPS labels (max 0.5px per
// typography anti-patterns list). Never applied to body copy.
export const letterSpacing = {
  "caps-label": "0.5px",
  normal: "0",
} satisfies Record<string, string>;
