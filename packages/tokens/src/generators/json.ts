// packages/tokens/src/generators/json.ts
//
// Flattens every token group into a single {name, value, category} list for
// documentation and dev tooling. Pure data, no filesystem access.

import { spacing } from "../primitives/spacing.ts";
import { borderRadius } from "../primitives/radius.ts";
import { boxShadow } from "../primitives/shadows.ts";
import {
  transitionDuration,
  transitionTimingFunction,
} from "../primitives/motion.ts";
import { zIndex, opacity } from "../primitives/effects.ts";
import { fontFamily } from "../primitives/typography.ts";
import { iconSize } from "../primitives/sizing.ts";
import { lightTheme, darkTheme } from "../semantic/index.ts";

export interface TokenMetadata {
  name: string;
  value: string;
  category: string;
  theme?: "light" | "dark";
}

function flatten(
  obj: Record<string, unknown>,
  category: string,
  prefix = "",
  theme?: "light" | "dark"
): TokenMetadata[] {
  const out: TokenMetadata[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(
        ...flatten(value as Record<string, unknown>, category, name, theme)
      );
    } else {
      out.push({
        name,
        value: String(value),
        category,
        ...(theme ? { theme } : {}),
      });
    }
  }
  return out;
}

export function getAllTokenMetadata(): TokenMetadata[] {
  return [
    ...flatten(lightTheme, "color", "", "light"),
    ...flatten(darkTheme, "color", "", "dark"),
    ...flatten(spacing, "spacing"),
    ...flatten(borderRadius, "radius"),
    ...flatten(boxShadow, "shadow"),
    ...flatten(transitionDuration, "motion-duration"),
    ...flatten(transitionTimingFunction, "motion-easing"),
    ...flatten(zIndex, "z-index"),
    ...flatten(opacity, "opacity"),
    ...flatten(iconSize, "icon-size"),
    ...Object.entries(fontFamily).map(([name, value]) => ({
      name,
      value: value.join(", "),
      category: "font-family",
    })),
  ];
}
