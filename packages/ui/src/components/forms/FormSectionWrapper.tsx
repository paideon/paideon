import { cn } from "../../utilities/cn";

export interface FormSectionWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSectionWrapper({
  title,
  description,
  children,
  className,
}: FormSectionWrapperProps) {
  return (
    <div className={cn("mb-space-10", className)}>
      <div className="mb-space-6">
        <h3
          className={cn(
            "font-display text-h3 font-medium text-text-primary",
            description ? "mb-space-1.5" : "mb-0"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="font-body text-body-sm text-text-muted leading-relaxed">
            {description}
          </p>
        )}
        <div aria-hidden="true" className="mt-space-3.5 h-px bg-border-light" />
      </div>

      <div className="flex flex-col gap-space-5">{children}</div>
    </div>
  );
}
