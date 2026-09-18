import { cn } from "../../utilities/cn";

export interface PaginationProps {
  /** Total number of pages */
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  /** Max page buttons shown at once (default 7) */
  siblingCount?: number;
  className?: string;
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Builder for each page button's aria-label, receives the page number */
  getPageLabel?: (page: number) => string;
}

function getPageRange(
  current: number,
  total: number,
  siblings: number
): (number | "…")[] {
  const totalButtons = siblings * 2 + 5; // siblings + current + first + last + 2 ellipsis
  if (total <= totalButtons)
    return Array.from({ length: total }, (_, i) => i + 1);

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  const pages: (number | "…")[] = [1];
  if (showLeftDots) pages.push("…");
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }
  if (showRightDots) pages.push("…");
  pages.push(total);
  return pages;
}

const BTN_BASE =
  "font-body text-caption uppercase tracking-[0.08em] min-w-space-9 h-space-9 px-space-2 inline-flex items-center justify-center leading-none transition-all duration-fast";

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  className,
  ariaLabel = "Pagination",
  prevLabel = "Previous page",
  nextLabel = "Next page",
  getPageLabel = (page) => `Page ${page}`,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages, siblingCount);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex items-center gap-space-1 list-none p-0 m-0">
        {/* Prev */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            aria-label={prevLabel}
            className={cn(
              BTN_BASE,
              "border border-border-default bg-surface-elevated",
              isFirstPage
                ? "text-text-muted opacity-40 cursor-not-allowed"
                : "text-text-primary opacity-100 cursor-pointer"
            )}
          >
            ←
          </button>
        </li>

        {/* Page buttons */}
        {pages.map((page, idx) =>
          page === "…" ? (
            <li key={`dots-${idx}`} aria-hidden="true">
              <span
                className={cn(
                  BTN_BASE,
                  "border-none bg-transparent text-text-muted cursor-default"
                )}
              >
                …
              </span>
            </li>
          ) : (
            <li key={page}>
              <button
                onClick={() => onPageChange(page as number)}
                aria-label={getPageLabel(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={cn(
                  BTN_BASE,
                  "border",
                  currentPage === page
                    ? "bg-green-base text-text-inverse border-green-base"
                    : "bg-surface-elevated text-text-primary border-border-default"
                )}
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            aria-label={nextLabel}
            className={cn(
              BTN_BASE,
              "border border-border-default bg-surface-elevated",
              isLastPage
                ? "text-text-muted opacity-40 cursor-not-allowed"
                : "text-text-primary opacity-100 cursor-pointer"
            )}
          >
            →
          </button>
        </li>
      </ol>
    </nav>
  );
}
