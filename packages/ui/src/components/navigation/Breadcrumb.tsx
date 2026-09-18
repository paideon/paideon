import clsx from "clsx";

import { NavLink } from "../navigation/NavLink";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Light variant for use on dark hero backgrounds */
  onDark?: boolean;
  ariaLabel?: string;
}

export function Breadcrumb({
  items,
  onDark = false,
  ariaLabel = "Breadcrumb",
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="flex items-center flex-wrap gap-space-1p5 m-space-0 p-space-0 list-none">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-space-1p5">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={clsx(
                    "font-body text-xs",
                    onDark ? "text-text-inverse/30" : "text-text-muted"
                  )}
                >
                  ›
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={clsx(
                    "font-body text-caption uppercase tracking-caption",
                    isLast
                      ? onDark
                        ? "text-text-inverse/85"
                        : "text-text-primary"
                      : onDark
                      ? "text-text-inverse/45"
                      : "text-text-muted"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <NavLink
                  href={item.href}
                  onDark={onDark}
                  className="font-body text-caption uppercase tracking-caption"
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
