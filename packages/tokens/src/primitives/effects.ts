// packages/tokens/src/primitives/effects.ts

export const blur = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "16px",
} satisfies Record<string, string>;

export const opacity = {
  0: "0",
  5: "0.05",
  10: "0.1",
  20: "0.2",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8",
  90: "0.9",
  100: "1",
} satisfies Record<string, string>;

export const aspectRatio = {
  hero: "16 / 9",
  portrait: "3 / 4",
  square: "1 / 1",
  news: "4 / 3",
  event: "16 / 7",
} satisfies Record<string, string>;

export const zIndex = {
  base: "0",
  raised: "10",
  dropdown: "100",
  sticky: "200",
  overlay: "300",
  modal: "400",
  toast: "500",
  loading: "900",
} satisfies Record<string, string>;

export const backgroundImage = {
  "gradient-gold-subtle":
    "linear-gradient(135deg, rgba(201,151,58,0.18), rgba(26,74,46,0.0))",
  "gradient-hero-deep":
    "linear-gradient(180deg, rgba(26,74,46,0.0) 0%, rgba(26,74,46,0.72) 100%)",
  "gradient-overlay-fade":
    "linear-gradient(180deg, rgba(28,26,22,0.0) 0%, rgba(28,26,22,0.56) 100%)",
  "gradient-radial-gold":
    "radial-gradient(circle at center, rgba(201,151,58,0.18), transparent 70%)",
  "gradient-radial-canopy":
    "radial-gradient(ellipse 120% 120% at 50% 0%, var(--color-surface-canopy) 0%, var(--color-surface-elevated) 40%, var(--color-surface-deep) 70%, var(--color-surface-base) 100%)",
} satisfies Record<string, string>;

export const scale = {
  0: "0",
  50: "0.5",
  75: "0.75",
  90: "0.9",
  95: "0.95",
  100: "1",
  105: "1.05",
  110: "1.1",
  125: "1.25",
  150: "1.5",
  press: "0.98",
  "card-hover": "1.02",
} satisfies Record<string, string>;
