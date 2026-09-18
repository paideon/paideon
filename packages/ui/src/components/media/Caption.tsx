import { cn } from "../../utilities/cn";

export interface CaptionProps {
  children: React.ReactNode;
  /** Visual placement – 'inline' (below image) or 'overlay' (on top of image) */
  variant?: "inline" | "overlay";
  className?: string;
  ref?: React.Ref<HTMLElement>;
}

export function Caption({
  children,
  variant = "inline",
  className,
  ref,
}: CaptionProps) {
  return (
    <figcaption
      ref={ref}
      className={cn(
        "font-body text-caption text-text-muted",
        variant === "overlay" &&
          "absolute bottom-0 left-0 right-0 bg-overlay-medium text-text-inverse p-space-2 text-center",
        variant === "inline" && "mt-space-2 text-center",
        className
      )}
    >
      {children}
    </figcaption>
  );
}
