import type { ALStreamData } from "@paideon/contracts";

import { cn } from "../../utilities/cn";
import { Tag } from "../atoms/Tag";
import { Icon } from "../icons/Icon";
import { NavLink } from "../navigation/NavLink";
import { EyebrowLabel } from "../typography/EyebrowLabel";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface AcademicStreamCardProps extends Omit<ALStreamData, "key"> {
  href: string;
  className?: string;
  streamEyebrowLabel?: string;
  /** "N subjects" suffix builder */
  getSubjectCountLabel?: (count: number) => string;
  exploreLabel?: string;
}

export function AcademicStreamCard({
  name,
  description,
  careerPaths,
  subjects,
  href,
  className,
  streamEyebrowLabel = "A/L Stream",
  getSubjectCountLabel = (count) => ` · ${count} subjects`,
  exploreLabel = "Explore stream",
}: AcademicStreamCardProps) {
  return (
    <NavLink href={href} className="group block no-underline h-full">
      <div
        className={cn(
          "relative h-full overflow-hidden",
          "bg-surface-elevated border border-border-light",
          // Spacing — pt-space-7 (28px) top, px/pb-space-6 (24px) sides/bottom
          "pt-space-7 px-space-6 pb-space-6",
          // Elevation & motion
          "shadow-elevation-1",
          "transition-[box-shadow,transform] duration-standard ease-out",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-[2px]",
          className
        )}
      >
        {/* Green left accent bar — fades in on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-space-0 w-size-2 bg-green-base opacity-0 transition-opacity duration-standard group-hover:opacity-100"
        />

        {/* "A/L Stream · N subjects" eyebrow */}
        <EyebrowLabel as="p" className="mb-space-1p5">
          {streamEyebrowLabel}
          {subjects.length > 0 ? getSubjectCountLabel(subjects.length) : ""}
        </EyebrowLabel>

        {/* Stream name */}
        <Heading
          level="h3"
          color="primary"
          className="mb-space-2p5 transition-colors duration-fast ease-snap group-hover:text-gold-active"
        >
          {name}
        </Heading>

        {/* Description */}
        <Text
          variant="body-sm"
          color="muted"
          className="mb-space-4 leading-[1.65]"
        >
          {description}
        </Text>

        {/* Career path tags */}
        {careerPaths && careerPaths.length > 0 && (
          <div className="mb-space-5 flex flex-wrap gap-space-1p5">
            {careerPaths.map((path) => (
              <Tag
                key={path}
                label={path}
                className="border border-border-light bg-surface-deep"
              />
            ))}
          </div>
        )}

        <Text as="span" variant="label" color="gold">
          {exploreLabel} <span>{<Icon name="arrow-right" />}</span>
        </Text>
      </div>
    </NavLink>
  );
}
