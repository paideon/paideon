import { type Ref, type ComponentPropsWithoutRef } from "react";

import { EyebrowLabel } from "./EyebrowLabel";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { cn } from "../../utilities/cn";
import { Divider } from "../layout/Divider";

type SectionHeaderVariant = "eyebrow-title" | "eyebrow-title-description";
type SectionHeaderAlign = "left" | "center";
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface SectionHeaderProps extends ComponentPropsWithoutRef<"div"> {
  /** The eyebrow (kicker) text above the main title */
  eyebrow?: string;
  /** The main title text */
  title: string;
  /** Optional emphasised part of the title (rendered in gold) */
  titleEm?: string;
  /** Optional description text below the title (only used when variant includes description) */
  description?: string;
  /** Alignment of the header content */
  align?: SectionHeaderAlign;
  /** Whether to show a small gold decorative rule below the eyebrow */
  withAccentRule?: boolean;
  /** Controls whether description is shown */
  variant?: SectionHeaderVariant;
  /** Semantic heading level (default h2) */
  headingLevel?: HeadingLevel;
  /** Custom bottom margin – use spacing tokens (e.g., 'mb-space-14') */
  marginBottom?: string;
  headingClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

export const SectionHeader = ({
  eyebrow,
  title,
  titleEm,
  description,
  align = "left",
  withAccentRule = false,
  variant = "eyebrow-title",
  headingLevel = "h2",
  marginBottom = "mb-space-14",
  headingClassName,
  className,
  ref,
  ...rest
}: SectionHeaderProps) => {
  const isCenter = align === "center";
  const showDescription =
    variant === "eyebrow-title-description" && !!description;

  return (
    <div
      ref={ref}
      className={cn(
        isCenter ? "text-center" : "text-left",
        marginBottom,
        className
      )}
      {...rest}
    >
      {eyebrow && (
        <EyebrowLabel
          className={cn(withAccentRule ? "mb-space-3p5" : "mb-space-4")}
        >
          {eyebrow}
        </EyebrowLabel>
      )}

      {withAccentRule && (
        <Divider
          accentVariant="gold-accent-narrow"
          className={cn("my-space-2", isCenter ? "mx-auto" : "")}
        />
      )}

      <Heading level={headingLevel} className={cn("text-h2", headingClassName)}>
        {title}
        {titleEm && (
          <>
            {" "}
            <em className="text-gold-base not-italic">{titleEm}</em>
          </>
        )}
      </Heading>

      {showDescription && (
        <Text
          variant="body"
          color="muted"
          className={cn(isCenter && "mx-auto", "max-w-prose", "mt-space-1")}
        >
          {description}
        </Text>
      )}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";
