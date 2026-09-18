"use client";

import { useState } from "react";

import { Checkbox } from "./Checkbox";
import { cn } from "../../utilities/cn";

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
}

export interface RequirementsChecklistProps {
  title: string;
  items: ChecklistItem[];
  onComplete?: (completedIds: string[]) => void;
  className?: string;
  printLabel?: string;
  requiredLabel?: string;
}

export function RequirementsChecklist({
  title,
  items,
  onComplete,
  className,
  printLabel = "Print Checklist",
  requiredLabel = "*Required",
}: RequirementsChecklistProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
    onComplete?.(Array.from(newCompleted));
  };

  const allRequiredComplete = items
    .filter((item) => item.required)
    .every((item) => completed.has(item.id));

  return (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light rounded-lg p-space-6",
        className
      )}
    >
      <div className="mb-space-4 pb-space-4 border-b border-border-light">
        <h3 className="font-display text-h3 mb-space-2">{title}</h3>
        <p className="font-body text-body-sm text-text-muted">
          {allRequiredComplete
            ? "✓ All required items completed"
            : `${
                items
                  .filter((i) => i.required)
                  .filter((i) => completed.has(i.id)).length
              }/${
                items.filter((i) => i.required).length
              } required items completed`}
        </p>
      </div>
      <div className="space-y-space-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-space-3">
            <Checkbox
              label={item.label}
              description={item.description}
              checked={completed.has(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            {item.required && (
              <span className="font-body text-caption text-semantic-error-base flex-shrink-0">
                {requiredLabel}
              </span>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => window.print()}
        className="mt-space-6 w-full py-space-2 text-center font-body text-caption uppercase tracking-caption text-gold-base border border-gold-base rounded-sm hover:bg-gold-base hover:text-green-base transition-colors"
      >
        {printLabel}
      </button>
    </div>
  );
}
