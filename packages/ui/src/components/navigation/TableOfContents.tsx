import type { TocSectionData } from "@paideon/contracts";

import { cn } from "../../utilities/cn";

export interface TableOfContentsProps {
  sections: TocSectionData[];
  /** ID of the currently visible section (passed in from parent's scroll observer) */
  activeId?: string;
  className?: string;
  ariaLabel?: string;
  headingLabel?: string;
}

export function TableOfContents({
  sections,
  activeId,
  className,
  ariaLabel = "Table of contents",
  headingLabel = "On this page",
}: TableOfContentsProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label={ariaLabel} className={cn("sticky top-[100px]", className)}>
      <p className="font-body text-label uppercase tracking-label text-text-muted mb-space-3.5">
        {headingLabel}
      </p>
      <ol className="list-none p-0 m-0">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block w-full text-left bg-transparent border-none border-l-2 py-space-1.5 pl-space-3.5",
                  "font-body text-[0.82rem] cursor-pointer transition-colors duration-fast",
                  isActive
                    ? "border-gold-base text-gold-base"
                    : "border-border-light text-text-muted hover:text-text-primary"
                )}
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
