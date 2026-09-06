// packages/tokens/src/semantic/colors.ts
//
// Source: design-system doc §2.2/§2.3, designer guide §2.3.
// Rule that cannot be broken: color must never be the only indicator of
// meaning. Every status token here must be paired with an icon in the
// component that consumes it — that pairing is a component-layer concern,
// not something a token can enforce, but it's documented here so it isn't
// lost on the way to implementation.

import { primitives } from "../primitives/colors.ts";

export const statusColorsLight = {
  success: {
    bg: primitives.sage[50],
    text: primitives.sage[700],
    border: primitives.sage[200],
  },
  warning: {
    bg: primitives.gold[100],
    text: primitives.gold[700],
    border: primitives.gold[300],
  },
  danger: {
    bg: primitives.danger[100],
    text: primitives.danger[600],
    border: primitives.danger[500],
  },
  info: { bg: "#EBF1F7", text: "#2E5A7A", border: primitives.state.info },
} as const;

// Dark mode note (designer guide §2.4): the pale pastel light-mode
// backgrounds are nearly invisible on Ink. Dark mode uses translucent rgba
// washes instead of pale fills — the psychological signal is identical,
// only the strategy changes.
export const statusColorsDark = {
  success: {
    bg: "rgba(78,124,111,0.15)",
    text: primitives.sage[400],
    border: "rgba(78,124,111,0.35)",
  },
  warning: {
    bg: "rgba(201,168,76,0.15)",
    text: primitives.gold[300],
    border: "rgba(201,168,76,0.35)",
  },
  danger: {
    bg: "rgba(192,84,77,0.15)",
    text: "#D97B75",
    border: "rgba(192,84,77,0.35)",
  },
  info: {
    bg: "rgba(90,122,153,0.15)",
    text: "#8AAFC8",
    border: "rgba(90,122,153,0.35)",
  },
} as const;

// Achievement system — the Gold palette, exclusively. Must never appear in
// routine UI (nav, buttons, informational badges). See designer guide §2.2:
// "The Gold rule: Ask yourself — is this the moment we tell a student they
// excelled? If yes, use Gold. If you're hesitating, don't."
export const achievementLight = {
  bg: primitives.gold[100],
  accent: primitives.gold[500],
  text: primitives.gold[700],
  border: primitives.gold[300],
} as const;

export const achievementDark = {
  bg: "rgba(201,168,76,0.12)",
  accent: primitives.gold[300], // lighter gold reads warmer against Ink
  text: primitives.gold[300],
  border: "rgba(201,168,76,0.40)",
} as const;
