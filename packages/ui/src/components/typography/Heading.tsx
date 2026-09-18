import {
  type Ref,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";

import { cn } from "../../utilities/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingColor =
  | "primary"
  | "muted"
  | "inverse"
  | "gold"
  | "success"
  | "error"
  | "warning"
  | "info";

interface HeadingProps extends ComponentPropsWithoutRef<HeadingLevel> {
  /** Semantic heading level (also determines visual size) */
  level?: HeadingLevel;
  /** Override colour token (default primary) */
  color?: HeadingColor;
  /** Optional custom element (rare, but allows polymorphism) */
  as?: ElementType;
  ref?: Ref<HTMLElement>;
}

const levelSizeMap: Record<HeadingLevel, string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
};

const colorClasses: Record<HeadingColor, string> = {
  primary: "text-text-primary",
  muted: "text-text-muted",
  inverse: "text-text-inverse",
  gold: "text-text-gold",
  success: "text-semantic-success-base",
  error: "text-semantic-error-base",
  warning: "text-semantic-warning-base",
  info: "text-semantic-info-base",
};

export const Heading = ({
  level = "h2",
  color = "primary",
  as,
  className,
  children,
  ref,
  ...rest
}: HeadingProps) => {
  const Tag = as || level;
  return (
    <Tag
      ref={ref}
      className={cn(
        "font-display",
        colorClasses[color],
        levelSizeMap[level],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

Heading.displayName = "Heading";
