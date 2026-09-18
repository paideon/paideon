"use client";

import { useEffect, useRef, useState } from "react";

import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { cn } from "../../utilities/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MobileNavItem {
  label: string;
  href?: string;
  children?: MobileNavItem[];
}

export interface MobileMenuProps {
  items: MobileNavItem[];
  isOpen: boolean;
  onClose: () => void;
  /** Active pathname for highlighting */
  currentPath?: string;
  /** Header title, e.g. localized "Menu" */
  menuLabel?: string;
  /** aria-label for the Back button inside a sub-panel */
  backLabel?: string;
  /** aria-label for the close ("X") button */
  closeLabel?: string;
  /** aria-label for the drawer's dialog role */
  navLabel?: string;
  /** Optional content rendered in the header row, next to the menu label (e.g. a LanguageSwitcher) */
  headerExtra?: React.ReactNode;
  /** Optional footer content (e.g. school name) — omitted entirely when not provided */
  footer?: React.ReactNode;
}

// ─── Sub-level panel ──────────────────────────────────────────────────────────

interface SubPanelProps {
  item: MobileNavItem;
  onBack: () => void;
  onClose: () => void;
  currentPath?: string;
  backLabel: string;
}

function SubPanel({
  item,
  onBack,
  onClose,
  currentPath,
  backLabel,
}: SubPanelProps) {
  return (
    <div
      role="dialog"
      aria-label={item.label}
      className="kcc-submenu absolute inset-0 bg-green-base flex flex-col animate-[kcc-submenu-slide-in_0.22s_var(--ease-out,cubic-bezier(0,0,0.2,1))_both]"
    >
      {/* Sub-panel header */}
      <div className="flex items-center gap-space-3 py-space-5 px-space-6 border-b border-white/[0.08]">
        <button
          onClick={onBack}
          aria-label={backLabel}
          className={cn(
            "flex items-center gap-space-1.5 bg-none border-none cursor-pointer p-space-1",
            "font-body text-label uppercase tracking-label",
            "text-text-inverse/60 transition-colors duration-fast hover:text-gold-base"
          )}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {backLabel}
        </button>
        <span className="font-display text-h4 font-medium text-text-inverse ml-space-1">
          {item.label}
        </span>
      </div>

      {/* Sub-links */}
      <nav className="flex-1 overflow-y-auto py-space-3">
        <ul className="list-none p-0 m-0">
          {item.children?.map((child) => {
            const isActive = currentPath === child.href;
            return (
              <li key={child.href ?? child.label}>
                <a
                  href={child.href ?? "#"}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between py-space-3.5 px-space-6",
                    "font-body text-body no-underline border-l-2 transition-all duration-fast",
                    isActive
                      ? "text-gold-base border-gold-base"
                      : "text-text-inverse/85 border-transparent hover:text-text-inverse hover:border-gold-base/40"
                  )}
                >
                  {child.label}
                  {child.children && child.children.length > 0 && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// ─── Main MobileMenu ───────────────────────────────────────────────────────────

export function MobileMenu({
  items,
  isOpen,
  onClose,
  currentPath,
  menuLabel = "Menu",
  backLabel = "Back",
  closeLabel = "Close menu",
  navLabel = "Navigation menu",
  headerExtra,
  footer,
}: MobileMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<MobileNavItem | null>(
    null
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(isOpen);

  // Handle Escape (steps back out of a sub-panel first, then closes)
  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeSubmenu) setActiveSubmenu(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeSubmenu, onClose]);

  return (
    <>
      <style>{`
        @keyframes kcc-drawer-slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes kcc-submenu-slide-in {
          from { transform: translateX(32px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kcc-mobile-drawer, .kcc-submenu { animation: none !important; }
        }
      `}</style>

      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-[199] bg-[rgba(28,26,22,0.6)] backdrop-blur-[2px]"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={navLabel}
        aria-hidden={!isOpen}
        className={cn(
          "kcc-mobile-drawer fixed top-0 right-0 bottom-0 z-[200] w-[min(320px,90vw)]",
          "bg-green-base flex flex-col overflow-y-auto overflow-x-hidden transition-transform",
          isOpen
            ? "translate-x-0 animate-[kcc-drawer-slide-in_0.28s_var(--ease-out,cubic-bezier(0,0,0.2,1))_both]"
            : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-space-5 px-space-6 border-b border-white/[0.08] shrink-0">
          <span className="font-display text-body font-medium text-gold-base uppercase tracking-label">
            {menuLabel}
          </span>
          {headerExtra}
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className={cn(
              "flex items-center justify-center w-space-9 h-space-9",
              "bg-none border border-white/15 cursor-pointer",
              "text-text-inverse/70 transition-all duration-fast",
              "hover:bg-white/[0.08] hover:text-text-inverse"
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 relative overflow-hidden">
          {/* Root list */}
          <ul className="list-none py-space-3 m-0">
            {items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive = !hasChildren && currentPath === item.href;
              return (
                <li key={item.href ?? item.label}>
                  {hasChildren ? (
                    <button
                      onClick={() => setActiveSubmenu(item)}
                      className={cn(
                        "flex items-center justify-between w-full py-space-4 px-space-6 text-left",
                        "bg-none border-none border-l-2 border-transparent cursor-pointer",
                        "font-display text-h4 font-medium text-text-inverse transition-all duration-fast",
                        "hover:text-gold-base hover:border-gold-base"
                      )}
                    >
                      {item.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={item.href ?? "#"}
                      onClick={onClose}
                      className={cn(
                        "block py-space-4 px-space-6 no-underline border-l-2 transition-all duration-fast",
                        "font-display text-h4 font-medium",
                        isActive
                          ? "text-gold-base border-gold-base"
                          : "text-text-inverse border-transparent hover:text-gold-base hover:border-gold-base/40"
                      )}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Submenu overlay */}
          {activeSubmenu && (
            <SubPanel
              item={activeSubmenu}
              onBack={() => setActiveSubmenu(null)}
              onClose={onClose}
              currentPath={currentPath}
              backLabel={backLabel}
            />
          )}
        </nav>

        {/* Footer strip — only rendered when the consumer passes content */}
        {footer && (
          <div className="py-space-5 px-space-6 border-t border-white/[0.08] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
