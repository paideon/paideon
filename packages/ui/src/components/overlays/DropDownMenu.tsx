// packages/ui/src/components/overlays/DropDownMenu.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useId, useCallback } from "react";

import { cn } from "../../utilities/cn";

export type DropdownMenuVariant = "navigation" | "filter";

export interface DropdownMenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  variant?: DropdownMenuVariant;
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  variant = "navigation",
  trigger,
  items,
  align = "left",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const triggerId = useId();
  const router = useRouter();

  const closeMenu = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.onClick) item.onClick();
    if (item.href) router.push(item.href);
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          const item = items[activeIndex];
          if (item.href) {
            router.push(item.href);
          } else if (item.onClick) {
            item.onClick();
          }
          closeMenu();
        }
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

  // Click outside handler
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeMenu]);

  // Reset active index when menu opens
  useEffect(() => {
    if (open) setActiveIndex(-1);
  }, [open]);

  const triggerClasses = cn(
    "inline-flex items-center gap-space-1p5",
    "bg-transparent border-none cursor-pointer",
    "transition-all duration-fast ease-snap",
    "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]",
    variant === "filter" && [
      "px-space-3 py-space-2",
      "font-body text-label uppercase tracking-label",
      "text-text-primary",
      "border border-border-default",
      "bg-surface-elevated",
      "rounded-sm",
      "hover:border-gold-base hover:text-gold-base",
    ],
    variant === "navigation" && [
      "font-body text-label uppercase tracking-label",
      "text-text-muted",
      "hover:text-text-primary",
    ]
  );

  const menuClasses = cn(
    "absolute z-dropdown min-w-[160px] py-space-1",
    "bg-surface-elevated border border-border-light",
    "shadow-elevation-2",
    align === "right" ? "right-0" : "left-0",
    "top-full mt-space-1"
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={triggerClasses}
      >
        {trigger}
        <span
          aria-hidden="true"
          className={cn(
            "transition-transform duration-fast",
            open ? "rotate-180" : "rotate-0"
          )}
        >
          ∨
        </span>
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={menuClasses}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.id} role="none">
                <button
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full text-left px-space-4 py-space-2p5",
                    "font-body text-label uppercase tracking-label",
                    "transition-colors duration-fast",
                    "focus:outline-none",
                    isActive
                      ? "bg-surface-deep text-gold-base"
                      : "text-text-primary hover:bg-surface-default hover:text-gold-base"
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
