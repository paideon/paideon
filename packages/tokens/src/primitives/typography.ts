// packages/tokens/src/primitives/typography.ts

// =============================================================================
// Font Families
// =============================================================================
export const fontFamily = {
  display: [
    "var(--font-display)",
    "var(--font-sinhala-display)",
    "var(--font-tamil-display)",
    "Georgia",
    "serif",
  ],
  body: [
    "var(--font-body)",
    "var(--font-sinhala-body)",
    "var(--font-tamil-body)",
    "system-ui",
    "-apple-system",
    "sans-serif",
  ],
  quote: [
    "var(--font-quote)",
    "var(--font-sinhala-display)",
    "var(--font-tamil-display)",
    "Georgia",
    "serif",
  ],
  mono: ["var(--font-mono)", "Menlo", "monospace"],
} satisfies Record<string, string[]>;

// =============================================================================
// Font Sizes
// =============================================================================
export const fontSize = {
  // ── English ────────────────────────────────────────────────────────────────
  display: [
    "clamp(2.25rem, 1.75rem + 2.5vw, 4rem)",
    { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" },
  ],
  h1: [
    "clamp(2rem, 1.61rem + 1.94vw, 3.36rem)",
    { lineHeight: "1.05", letterSpacing: "-0.01em", fontWeight: "600" },
  ],
  h2: [
    "clamp(1.75rem, 1.45rem + 1.5vw, 2.8rem)",
    { lineHeight: "1.08", letterSpacing: "0", fontWeight: "500" },
  ],
  h3: [
    "clamp(1.5rem, 1.26rem + 1.19vw, 2.33rem)",
    { lineHeight: "1.12", letterSpacing: "0", fontWeight: "500" },
  ],
  h4: [
    "clamp(1.3rem, 1.12rem + 0.91vw, 1.94rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "500" },
  ],
  h5: [
    "clamp(1.15rem, 1.04rem + 0.57vw, 1.55rem)",
    { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
  ],
  h6: [
    "clamp(1rem, 0.93rem + 0.36vw, 1.25rem)",
    { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" },
  ],
  pullquote: [
    "clamp(1.2rem, 1.09rem + 0.57vw, 1.6rem)",
    { lineHeight: "1.3", letterSpacing: "0.01em", fontWeight: "500" },
  ],
  body: [
    "1.05rem",
    { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" },
  ],
  "body-sm": [
    "0.87rem",
    { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
  ],
  label: [
    "0.83rem",
    {
      lineHeight: "1.4",
      letterSpacing: "0.15em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  // Intentionally identical to `label` — kept as a separate semantic key
  // so components can use the size-context-appropriate name without
  // implying they differ today. Don't "deduplicate" this away.
  "label-sm": [
    "0.83rem",
    {
      lineHeight: "1.4",
      letterSpacing: "0.15em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  eyebrow: [
    "0.75rem",
    {
      lineHeight: "1.4",
      letterSpacing: "0.25em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  caption: [
    "0.69rem",
    {
      lineHeight: "1.4",
      letterSpacing: "0.08em",
      fontWeight: "400",
      textTransform: "uppercase",
    },
  ],
  code: ["0.9em", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],

  // ── Sinhala ────────────────────────────────────────────────────────────────
  // Physical sizes intentionally mirror the English clamps — only
  // line-height/letter-spacing/weight differ per script.
  "sinhala-display": [
    "clamp(2.25rem, 1.75rem + 2.5vw, 4rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "600" },
  ],
  "sinhala-h1": [
    "clamp(2rem, 1.61rem + 1.94vw, 3.36rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "600" },
  ],
  "sinhala-h2": [
    "clamp(1.75rem, 1.45rem + 1.5vw, 2.8rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-h3": [
    "clamp(1.5rem, 1.26rem + 1.19vw, 2.33rem)",
    { lineHeight: "1.18", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-h4": [
    "clamp(1.3rem, 1.12rem + 0.91vw, 1.94rem)",
    { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-h5": [
    "clamp(1.15rem, 1.04rem + 0.57vw, 1.55rem)",
    { lineHeight: "1.25", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-h6": [
    "clamp(1rem, 0.93rem + 0.36vw, 1.25rem)",
    { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-pullquote": [
    "clamp(1.2rem, 1.09rem + 0.57vw, 1.6rem)",
    { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" },
  ],
  "sinhala-body": [
    "1.05rem",
    { lineHeight: "1.8", letterSpacing: "0", fontWeight: "400" },
  ],
  "sinhala-body-sm": [
    "0.87rem",
    { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" },
  ],
  "sinhala-label": [
    "0.83rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "sinhala-label-sm": [
    "0.83rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "sinhala-eyebrow": [
    "0.75rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.15em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "sinhala-caption": [
    "0.69rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "400",
      textTransform: "uppercase",
    },
  ],
  "sinhala-code": [
    "0.9em",
    { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" },
  ],

  // ── Tamil ──────────────────────────────────────────────────────────────────
  "tamil-display": [
    "clamp(2.25rem, 1.75rem + 2.5vw, 4rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "600" },
  ],
  "tamil-h1": [
    "clamp(2rem, 1.61rem + 1.94vw, 3.36rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "600" },
  ],
  "tamil-h2": [
    "clamp(1.75rem, 1.45rem + 1.5vw, 2.8rem)",
    { lineHeight: "1.15", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-h3": [
    "clamp(1.5rem, 1.26rem + 1.19vw, 2.33rem)",
    { lineHeight: "1.18", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-h4": [
    "clamp(1.3rem, 1.12rem + 0.91vw, 1.94rem)",
    { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-h5": [
    "clamp(1.15rem, 1.04rem + 0.57vw, 1.55rem)",
    { lineHeight: "1.25", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-h6": [
    "clamp(1rem, 0.93rem + 0.36vw, 1.25rem)",
    { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-pullquote": [
    "clamp(1.2rem, 1.09rem + 0.57vw, 1.6rem)",
    { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" },
  ],
  "tamil-body": [
    "1.05rem",
    { lineHeight: "1.8", letterSpacing: "0", fontWeight: "400" },
  ],
  "tamil-body-sm": [
    "0.87rem",
    { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" },
  ],
  "tamil-label": [
    "0.83rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "tamil-label-sm": [
    "0.83rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "tamil-eyebrow": [
    "0.75rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.15em",
      fontWeight: "500",
      textTransform: "uppercase",
    },
  ],
  "tamil-caption": [
    "0.69rem",
    {
      lineHeight: "1.5",
      letterSpacing: "0.08em",
      fontWeight: "400",
      textTransform: "uppercase",
    },
  ],
  "tamil-code": [
    "0.9em",
    { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" },
  ],
} satisfies Record<string, [string, Record<string, string>]>;

// =============================================================================
// Line Heights
// =============================================================================
const utilityLineHeight = {
  tight: "1",
  snug: "1.08",
  normal: "1.6",
  relaxed: "1.7",
  loose: "1.3",
} satisfies Record<string, string>;

const perTokenLineHeight = Object.fromEntries(
  Object.entries(fontSize).map(([key, [, opts]]) => [key, opts.lineHeight])
) as Record<keyof typeof fontSize, string>;

export const lineHeight = { ...utilityLineHeight, ...perTokenLineHeight };

// =============================================================================
// Letter Spacing
// =============================================================================
const utilityLetterSpacing = {
  tight: "-0.02em",
  normal: "0em",
  open: "0.08em",
  wide: "0.15em",
  extended: "0.25em",

  "sinhala-tight": "-0.02em",
  "sinhala-normal": "0em",
  "sinhala-open": "0.04em",
  "sinhala-wide": "0.08em",
  "sinhala-extended": "0.12em",

  "tamil-tight": "-0.02em",
  "tamil-normal": "0em",
  "tamil-open": "0.04em",
  "tamil-wide": "0.08em",
  "tamil-extended": "0.12em",
} satisfies Record<string, string>;

const perTokenLetterSpacing = Object.fromEntries(
  Object.entries(fontSize).map(([key, [, opts]]) => [key, opts.letterSpacing])
) as Record<keyof typeof fontSize, string>;

export const letterSpacing = {
  ...utilityLetterSpacing,
  ...perTokenLetterSpacing,
};
