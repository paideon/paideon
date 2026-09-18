// packages/ui/src/components/layout/Grid.tsx

import { cn } from "../../utilities/cn";

type GridColumns = number | string; // e.g., 3, '12', 'repeat(auto-fit,minmax(250px,1fr))'
type GridRows = number | string;
type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridFlow = "row" | "col" | "row-dense" | "col-dense";
type PlaceItems = "start" | "end" | "center" | "stretch";
type JustifyItems = "start" | "end" | "center" | "stretch";
type AlignItems = "start" | "end" | "center" | "stretch" | "baseline";
type PlaceContent =
  | "center"
  | "start"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";
type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly";
type AlignContent =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly"
  | "stretch";

interface GridProps {
  children: React.ReactNode;
  // Column & row definitions
  columns?: GridColumns;
  rows?: GridRows;
  autoCols?: "auto" | "min" | "max" | "fr" | string;
  autoRows?: "auto" | "min" | "max" | "fr" | string;
  // Gap
  gap?: GridGap;
  gapX?: GridGap;
  gapY?: GridGap;
  // Flow
  flow?: GridFlow;
  // Alignment of items inside cells
  placeItems?: PlaceItems;
  justifyItems?: JustifyItems;
  alignItems?: AlignItems;
  // Alignment of the grid itself
  placeContent?: PlaceContent;
  justifyContent?: JustifyContent;
  alignContent?: AlignContent;
  // Semantic element
  as?: "div" | "ul";
  className?: string;
}

const gapMap: Record<GridGap, string> = {
  0: "gap-0",
  1: "gap-space-1",
  2: "gap-space-2",
  3: "gap-space-3",
  4: "gap-space-4",
  5: "gap-space-5",
  6: "gap-space-6",
  7: "gap-space-7",
  8: "gap-space-8",
  9: "gap-space-9",
  10: "gap-space-10",
  11: "gap-space-11",
  12: "gap-space-12",
};

const gapXMap: Record<GridGap, string> = {
  0: "gap-x-0",
  1: "gap-x-space-1",
  2: "gap-x-space-2",
  3: "gap-x-space-3",
  4: "gap-x-space-4",
  5: "gap-x-space-5",
  6: "gap-x-space-6",
  7: "gap-x-space-7",
  8: "gap-x-space-8",
  9: "gap-x-space-9",
  10: "gap-x-space-10",
  11: "gap-x-space-11",
  12: "gap-x-space-12",
};

const gapYMap: Record<GridGap, string> = {
  0: "gap-y-0",
  1: "gap-y-space-1",
  2: "gap-y-space-2",
  3: "gap-y-space-3",
  4: "gap-y-space-4",
  5: "gap-y-space-5",
  6: "gap-y-space-6",
  7: "gap-y-space-7",
  8: "gap-y-space-8",
  9: "gap-y-space-9",
  10: "gap-y-space-10",
  11: "gap-y-space-11",
  12: "gap-y-space-12",
};

const flowMap: Record<GridFlow, string> = {
  row: "grid-flow-row",
  col: "grid-flow-col",
  "row-dense": "grid-flow-row-dense",
  "col-dense": "grid-flow-col-dense",
};

const placeItemsMap: Record<PlaceItems, string> = {
  start: "place-items-start",
  end: "place-items-end",
  center: "place-items-center",
  stretch: "place-items-stretch",
};

const justifyItemsMap: Record<JustifyItems, string> = {
  start: "justify-items-start",
  end: "justify-items-end",
  center: "justify-items-center",
  stretch: "justify-items-stretch",
};

const alignItemsMap: Record<AlignItems, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const placeContentMap: Record<PlaceContent, string> = {
  center: "place-content-center",
  start: "place-content-start",
  end: "place-content-end",
  between: "place-content-between",
  around: "place-content-around",
  evenly: "place-content-evenly",
  stretch: "place-content-stretch",
};

const justifyContentMap: Record<JustifyContent, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const alignContentMap: Record<AlignContent, string> = {
  start: "content-start",
  end: "content-end",
  center: "content-center",
  between: "content-between",
  around: "content-around",
  evenly: "content-evenly",
  stretch: "content-stretch",
};

function getGridColsClass(columns: GridColumns): string {
  if (typeof columns === "number") {
    // Map common numbers to Tailwind's grid-cols-*
    if (columns >= 1 && columns <= 12) return `grid-cols-${columns}`;
    return `grid-cols-[repeat(${columns},minmax(0,1fr))]`;
  }
  // string can be custom Tailwind class or arbitrary value
  if (columns.startsWith("repeat(") || columns.includes("[")) {
    return `grid-cols-[${columns}]`;
  }
  return columns; // assume it's a valid Tailwind class like 'grid-cols-2'
}

function getGridRowsClass(rows: GridRows): string {
  if (typeof rows === "number") {
    return `grid-rows-${rows}`;
  }
  if (rows.startsWith("repeat(") || rows.includes("[")) {
    return `grid-rows-[${rows}]`;
  }
  return rows;
}

function getAutoClass(
  prefix: "auto-cols" | "auto-rows",
  value: string
): string {
  const map: Record<string, string> = {
    auto: `${prefix}-auto`,
    min: `${prefix}-min`,
    max: `${prefix}-max`,
    fr: `${prefix}-fr`,
  };
  if (map[value]) return map[value];
  return `${prefix}-[${value}]`;
}

export function Grid({
  children,
  columns = 3,
  rows,
  autoCols,
  autoRows,
  gap,
  gapX,
  gapY,
  flow,
  placeItems,
  justifyItems,
  alignItems,
  placeContent,
  justifyContent,
  alignContent,
  as: Tag = "div",
  className,
}: GridProps) {
  const classes = cn(
    "grid",
    getGridColsClass(columns),
    rows && getGridRowsClass(rows),
    autoCols && getAutoClass("auto-cols", autoCols),
    autoRows && getAutoClass("auto-rows", autoRows),
    gap !== undefined && gapMap[gap],
    gapX !== undefined && gapXMap[gapX],
    gapY !== undefined && gapYMap[gapY],
    flow && flowMap[flow],
    placeItems && placeItemsMap[placeItems],
    justifyItems && justifyItemsMap[justifyItems],
    alignItems && alignItemsMap[alignItems],
    placeContent && placeContentMap[placeContent],
    justifyContent && justifyContentMap[justifyContent],
    alignContent && alignContentMap[alignContent],
    className
  );

  return <Tag className={classes}>{children}</Tag>;
}

// ─── GridItem ────────────────────────────────────────────────────────────────

interface GridItemProps {
  children: React.ReactNode;
  colSpan?: number | string; // e.g., 2, 'span 3', '1 / 4'
  rowSpan?: number | string;
  colStart?: number | string;
  colEnd?: number | string;
  rowStart?: number | string;
  rowEnd?: number | string;
  justifySelf?: "auto" | "start" | "end" | "center" | "stretch";
  alignSelf?: "auto" | "start" | "end" | "center" | "stretch" | "baseline";
  placeSelf?: "auto" | "start" | "end" | "center" | "stretch";
  className?: string;
}

function getSpanClass(prefix: "col" | "row", value: number | string): string {
  if (typeof value === "number") {
    return `${prefix}-span-${value}`;
  }
  // allow arbitrary values like 'span 3' or '1 / 4'
  if (value.includes(" ")) {
    return `${prefix}-[${value}]`;
  }
  return `${prefix}-span-${value}`;
}

function getStartEndClass(
  prefix: "col" | "row",
  side: "start" | "end",
  value: number | string
): string {
  if (typeof value === "number") {
    return `${prefix}-${side}-${value}`;
  }
  return `${prefix}-[${value}]`;
}

const justifySelfMap: Record<string, string> = {
  auto: "justify-self-auto",
  start: "justify-self-start",
  end: "justify-self-end",
  center: "justify-self-center",
  stretch: "justify-self-stretch",
};

const alignSelfMap: Record<string, string> = {
  auto: "self-auto",
  start: "self-start",
  end: "self-end",
  center: "self-center",
  stretch: "self-stretch",
  baseline: "self-baseline",
};

const placeSelfMap: Record<string, string> = {
  auto: "place-self-auto",
  start: "place-self-start",
  end: "place-self-end",
  center: "place-self-center",
  stretch: "place-self-stretch",
};

export function GridItem({
  children,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  justifySelf,
  alignSelf,
  placeSelf,
  className,
}: GridItemProps) {
  const classes = cn(
    colSpan && getSpanClass("col", colSpan),
    rowSpan && getSpanClass("row", rowSpan),
    colStart && getStartEndClass("col", "start", colStart),
    colEnd && getStartEndClass("col", "end", colEnd),
    rowStart && getStartEndClass("row", "start", rowStart),
    rowEnd && getStartEndClass("row", "end", rowEnd),
    justifySelf && justifySelfMap[justifySelf],
    alignSelf && alignSelfMap[alignSelf],
    placeSelf && placeSelfMap[placeSelf],
    className
  );

  return <div className={classes}>{children}</div>;
}
