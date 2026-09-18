// packages/ui/src/components/visualization/DataTable.tsx
"use client";

import { useState, useCallback } from "react";

import { cn } from "../../utilities/cn";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: keyof T, direction: SortDirection) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  /**
   * Derives a stable React key per row. Defaults to the row index, which is
   * fine for static/non-reorderable data but risks losing input focus,
   * animation, or selection state across re-renders for data that can be
   * sorted, filtered, or reordered. Pass e.g. `(row) => row.id` whenever the
   * row type has a stable identifier.
   */
  getRowKey?: (row: T, index: number) => string | number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  onRowClick,
  emptyMessage = "No data found",
  isLoading = false,
  getRowKey = (_row, index) => index,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: keyof T) => {
      if (!onSort) return;
      let newDirection: SortDirection = "asc";
      if (sortKey === key) {
        if (sortDirection === "asc") newDirection = "desc";
        else if (sortDirection === "desc") newDirection = null;
      }
      setSortKey(newDirection ? key : null);
      setSortDirection(newDirection);
      onSort(key, newDirection);
    },
    [sortKey, sortDirection, onSort]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-space-12">
        <div className="w-8 h-8 border-2 border-gold-base border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-default bg-surface-deep">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-space-4 py-space-3 text-left font-body text-label uppercase tracking-wider text-text-muted",
                  col.sortable &&
                    "cursor-pointer hover:text-gold-base transition-colors",
                  col.className
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-space-2">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-gold-base">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-space-4 py-space-12 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={getRowKey(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-border-light transition-colors",
                  onRowClick && "cursor-pointer hover:bg-surface-deep/50"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "px-space-4 py-space-3 font-body text-body-sm text-text-primary",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
