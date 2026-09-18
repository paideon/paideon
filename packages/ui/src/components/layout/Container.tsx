// packages/ui/src/components/layout/Container.tsx

import { cn } from "../../utilities/cn";

type ContainerSize = "sm" | "md" | "lg" | "full";
type ContainerPadding = "none" | "sm" | "md" | "lg";
type ContainerAs = "div" | "section" | "article";

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  padding?: ContainerPadding;
  as?: ContainerAs;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const sizeMap: Record<ContainerSize, string> = {
  sm: "max-w-prose",
  md: "max-w-content",
  lg: "max-w-wide",
  full: "max-w-none",
};

const paddingMap: Record<ContainerPadding, string> = {
  none: "p-space-0",
  sm: "p-space-4 sm:p-space-6",
  md: "p-space-6 md:p-space-8 lg:p-space-10",
  lg: "p-space-8 md:p-space-12 lg:p-space-16",
};

export function Container({
  children,
  size = "md",
  padding = "md",
  as: Tag = "div",
  className,
  ref,
}: ContainerProps) {
  return (
    <Tag
      ref={ref}
      className={cn("mx-auto", sizeMap[size], paddingMap[padding], className)}
    >
      {children}
    </Tag>
  );
}
