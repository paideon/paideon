// packages/ui/src/components/navigation/Accordion.tsx
"use client";

import { useState } from "react";

import { cn } from "../../utilities/cn";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple open at once */
  allowMultiple?: boolean;
  className?: string;
}

function AccordionSingle({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // IDs are derived from item.id directly (no useId() needed here).
  const buttonId = `accordion-button-${item.id}`;
  const panelId = `accordion-panel-${item.id}`;

  return (
    <div className="border-b border-border-default">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "w-full flex items-center justify-between gap-space-4 py-space-5",
          "bg-transparent border-none cursor-pointer text-left",
          "transition-colors duration-fast ease-snap",
          "hover:text-gold-base",
          "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]"
        )}
      >
        <span
          className={cn("font-body text-body font-medium", "text-text-primary")}
        >
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-gold-base text-body flex-shrink-0",
            "transition-transform duration-standard ease-out",
            isOpen ? "rotate-180" : "rotate-0",
            "motion-reduce:transition-none motion-reduce:rotate-0"
          )}
        >
          ∨
        </span>
      </button>

      {/*
        Uses a CSS grid-template-rows trick (1fr / 0fr) rather than an explicit
        maxHeight, so the collapse/expand animation speed stays consistent
        regardless of content length.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-standard ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-space-5">
            <p
              className={cn(
                "font-body text-body-sm",
                "text-text-muted",
                "leading-relaxed"
              )}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  items,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className={cn("border-t border-border-default", className)}>
      {items.map((item) => (
        <AccordionSingle
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
