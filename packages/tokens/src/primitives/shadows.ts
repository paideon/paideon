// packages/tokens/src/primitives/shadows.ts

export const boxShadow = {
  "elevation-0": "none",
  "elevation-1": "0 2px 4px rgba(28,26,22,0.08)",
  "elevation-2": "0 8px 20px rgba(28,26,22,0.12)",
  "elevation-3": "0 16px 40px rgba(28,26,22,0.15)",
  "elevation-4": "0 24px 64px rgba(28,26,22,0.18)",
  "elevation-5": "0 32px 80px rgba(28,26,22,0.22)",
  "elevation-6": "0 48px 120px rgba(28,26,22,0.26)",
  "glass-shadow":
    "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(218,241,222,0.06)",
  "glass-shadow-heavy":
    "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(218,241,222,0.08)",
} satisfies Record<string, string>;
