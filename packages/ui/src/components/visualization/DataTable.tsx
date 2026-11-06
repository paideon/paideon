// packages/ui/src/components/visualization/DataTable.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../utilities/cn';

export type SortDirection = 'asc' | 'desc' | null;

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
  /**
   * Controlled sort, for tables sorted by the server. When given, the header
   * arrow follows this value instead of the table's own memory of clicks.
   */
  sort?: { key: keyof T; direction: 'asc' | 'desc' } | null;
  /** Adds a checkbox column. Needs `getRowKey` to give each row a stable id. */
  selectable?: boolean;
  selectedKeys?: ReadonlySet<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Accessible name of a row's checkbox, e.g. (row) => `Select ${row.name}`. */
  getRowLabel?: (row: T) => string;
  /** Label for the select-all checkbox. */
  selectAllLabel?: string;
}

function SelectBox({
  checked,
  indeterminate = false,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
      onClick={(event) => event.stopPropagation()}
      className="h-4 w-4 cursor-pointer accent-green-base focus-visible:outline-2 focus-visible:outline-gold-base"
    />
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  onRowClick,
  emptyMessage = 'No data found',
  isLoading = false,
  getRowKey = (_row, index) => index,
  sort,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  getRowLabel = () => 'Select row',
  selectAllLabel = 'Select all rows on this page',
}: DataTableProps<T>) {
  const [ownSortKey, setSortKey] = useState<keyof T | null>(null);
  const [ownSortDirection, setSortDirection] = useState<SortDirection>(null);
  const controlled = sort !== undefined;
  const sortKey = controlled ? (sort?.key ?? null) : ownSortKey;
  const sortDirection: SortDirection = controlled
    ? (sort?.direction ?? null)
    : ownSortDirection;

  const rowKeys = data.map((row, index) => getRowKey(row, index));
  const selectedOnPage = rowKeys.filter((key) => selectedKeys?.has(key)).length;
  const allSelected = data.length > 0 && selectedOnPage === data.length;

  const toggleAll = (checked: boolean) => {
    const next = new Set(selectedKeys ?? []);
    for (const key of rowKeys) {
      if (checked) next.add(key);
      else next.delete(key);
    }
    onSelectionChange?.(next);
  };
  const toggleOne = (key: string | number, checked: boolean) => {
    const next = new Set(selectedKeys ?? []);
    if (checked) next.add(key);
    else next.delete(key);
    onSelectionChange?.(next);
  };
  const columnCount = columns.length + (selectable ? 1 : 0);

  const handleSort = useCallback(
    (key: keyof T) => {
      if (!onSort) return;
      let newDirection: SortDirection = 'asc';
      if (sortKey === key) {
        if (sortDirection === 'asc') newDirection = 'desc';
        else if (sortDirection === 'desc') newDirection = null;
      }
      setSortKey(newDirection ? key : null);
      setSortDirection(newDirection);
      onSort(key, newDirection);
    },
    [sortKey, sortDirection, onSort],
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
            {selectable && (
              <th className="w-10 px-space-4 py-space-3">
                <SelectBox
                  checked={allSelected}
                  indeterminate={selectedOnPage > 0 && !allSelected}
                  label={selectAllLabel}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                aria-sort={
                  col.sortable && sortKey === col.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
                className={cn(
                  'px-space-4 py-space-3 text-left font-body text-label uppercase tracking-wider text-text-muted',
                  col.sortable &&
                    'cursor-pointer hover:text-gold-base transition-colors',
                  col.className,
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-space-2">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-gold-base">
                      {sortDirection === 'asc' ? '↑' : '↓'}
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
                colSpan={columnCount}
                className="px-space-4 py-space-12 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const key = rowKeys[idx];
              const selected = selectedKeys?.has(key) ?? false;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  aria-selected={selectable ? selected : undefined}
                  className={cn(
                    'border-b border-border-light transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-deep/50',
                    selected && 'bg-gold-pale/40',
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-space-4 py-space-3">
                      <SelectBox
                        checked={selected}
                        label={getRowLabel(row)}
                        onChange={(checked) => toggleOne(key, checked)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-space-4 py-space-3 font-body text-body-sm text-text-primary',
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
