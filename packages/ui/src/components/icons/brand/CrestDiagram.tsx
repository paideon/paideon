"use client";

import type { CrestSymbol } from "@paideon/contracts";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

import { SchoolLogo } from "./SchoolLogo";
import { cn } from "../../../utilities/cn";
import { SvgDebugGrid } from "../../dev/SvgDebugGrid";
import { Container } from "../../layout/Container";
import { EyebrowLabel } from "../../typography/EyebrowLabel";
import { Text } from "../../typography/Text";

type HotspotPosition =
  | "top-right"
  | "bottom-right"
  | "top-left"
  | "bottom-left";

type DiagramVariant = "ambient" | "hold" | "click";

export interface CrestDiagramProps {
  symbols?: CrestSymbol[];
  variant?: DiagramVariant;
  debug?: boolean;
  className?: string;
}

const DOT_POSITIONS: Record<HotspotPosition, string> = {
  "top-right": "top-[20%] -right-[11px]",
  "bottom-right": "bottom-[20%] -right-[11px]",
  "top-left": "top-[20%] -left-[11px]",
  "bottom-left": "bottom-[20%] -left-[11px]",
};

const LABEL_POSITIONS: Record<HotspotPosition, string> = {
  "top-right": "top-[8%] right-[6%]",
  "bottom-right": "bottom-[8%] right-[6%]",
  "top-left": "top-[8%] left-[6%]",
  "bottom-left": "bottom-[8%] left-[6%]",
};

const DEFAULT_SYMBOLS: CrestSymbol[] = [
  {
    id: "lamp",
    name: "The Lamp of Knowledge",
    meaning:
      "The oil lamp — Pahana — represents the light of education driving away the darkness of ignorance.",
    position: "top-right",
  },
  {
    id: "lotus",
    name: "The Lotus",
    meaning:
      "Rising from murky water to bloom in perfect form, the lotus symbolises the potential within every student — regardless of circumstance — to achieve purity and excellence.",
    position: "top-left",
  },
  {
    id: "dharmachakra",
    name: "The Dharmachakra",
    meaning:
      "The wheel of the dharma represents truth, righteousness, and the cyclical pursuit of wisdom. It reminds us that learning is never finished.",
    position: "bottom-left",
  },
  {
    id: "laurel",
    name: "The Laurel",
    meaning:
      "The laurel wreath encircling the crest signifies achievement, honour, and the recognition of excellence in academic, sporting, and cultural endeavour.",
    position: "bottom-right",
  },
];

export function CrestDiagram({
  symbols = DEFAULT_SYMBOLS,
  variant = "ambient",
  className,
  debug,
}: CrestDiagramProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Record<string, string>>({});
  const [containerSize, setContainerSize] = useState({
    width: 190,
    height: 100,
  });

  // ── Unified Interaction Handlers ──
  const handlePointerEnter = (id: string) => {
    if (variant === "ambient") {
      setActiveId(id);
    } else {
      setHoveredId(id);
    }
  };

  const handlePointerLeave = () => {
    if (variant === "ambient") {
      setActiveId(null);
    } else if (variant === "hold") {
      setHoveredId(null);
      setActiveId(null);
    } else {
      setHoveredId(null);
    }
  };

  const handlePointerDown = (id: string) => {
    if (variant === "hold") setActiveId(id);
  };

  const handlePointerUp = () => {
    if (variant === "hold") setActiveId(null);
  };

  const handleClick = (id: string) => {
    if (variant === "click") {
      setActiveId((prev) => (prev === id ? null : id));
    }
  };

  // ── Responsive Line + Size Calculations ──
  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    if (container.width === 0 || container.height === 0) return;

    setContainerSize({ width: container.width, height: container.height });

    const newLines: Record<string, string> = {};

    symbols.forEach((symbol) => {
      const dot = containerRef.current?.querySelector(
        `[data-dot="${symbol.id}"]`
      );
      const label = containerRef.current?.querySelector(
        `[data-label="${symbol.id}"]`
      );
      if (!dot || !label) return;

      const dotRect = dot.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();

      const dotX = dotRect.left - container.left + dotRect.width / 2;
      const dotY = dotRect.top - container.top + dotRect.height / 2;
      const isLeft = symbol.position?.includes("left") ?? false;

      const labelX = isLeft
        ? labelRect.right - container.left
        : labelRect.left - container.left;
      const labelY = labelRect.top - container.top + labelRect.height / 2;
      const midX = labelX + (dotX - labelX) / 2;

      newLines[
        symbol.id
      ] = `${labelX},${labelY} ${midX},${labelY} ${midX},${dotY} ${dotX},${dotY}`;
    });
    setLines(newLines);
  }, [symbols]);

  useEffect(() => {
    const timer = requestAnimationFrame(() => calculateLines());

    const container = containerRef.current;
    if (!container) return () => cancelAnimationFrame(timer);

    const observer = new ResizeObserver(() => calculateLines());
    observer.observe(container);

    window.addEventListener("resize", calculateLines);
    document.fonts?.ready.then(() => calculateLines());

    return () => {
      cancelAnimationFrame(timer);
      observer.disconnect();
      window.removeEventListener("resize", calculateLines);
    };
  }, [calculateLines]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none w-size-screen-w-80 aspect-[190/100]",
        "my-space-2 bg-surface-active rounded-md overflow-hidden",
        className
      )}
    >
      {/* ── SVG Connector Network ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-base"
        viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
        aria-hidden
      >
        {debug && (
          <SvgDebugGrid
            width={containerSize.width}
            height={containerSize.height}
            step={5}
            majorEvery={5}
            showLabels
            show={true}
          />
        )}

        {symbols.map((symbol) => {
          const isActive = activeId === symbol.id;
          const isHovered = hoveredId === symbol.id;
          const points = lines[symbol.id];
          if (!points) return null;

          const shouldAnimate =
            variant === "ambient" || (isHovered && !isActive);

          return (
            <motion.polyline
              key={symbol.id}
              points={points}
              className={cn(
                "fill-none transition-colors duration-300 ease-out",
                isActive
                  ? "stroke-gold-base"
                  : isHovered && variant !== "ambient"
                  ? "stroke-gold-base/60"
                  : "stroke-border-strong/70"
              )}
              strokeWidth={isActive ? 2.5 : 2}
              strokeDasharray={isActive && variant !== "ambient" ? "0" : "4 4"}
              strokeLinejoin="round"
              animate={
                shouldAnimate
                  ? { strokeDashoffset: [0, -16] }
                  : { strokeDashoffset: 0 }
              }
              transition={{
                repeat: Infinity,
                duration: variant === "ambient" ? 1.2 : 1,
                ease: "linear",
              }}
            />
          );
        })}
      </svg>

      {/* ── Center Crest Card ── */}
      <Container
        padding="none"
        className={cn(
          "w-size-screen-w-20 aspect-[1/1.2]",
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-raised",
          "rounded-md bg-surface-elevated border-border-sm border-solid border-border-light shadow-elevation-3",
          "flex items-center justify-center"
        )}
      >
        <SchoolLogo />
        {symbols.map((symbol) => {
          const isActive = activeId === symbol.id;
          const isHovered = hoveredId === symbol.id;

          return (
            <button
              key={symbol.id}
              data-dot={symbol.id}
              onClick={() => handleClick(symbol.id)}
              onPointerDown={() => handlePointerDown(symbol.id)}
              onPointerUp={handlePointerUp}
              onPointerEnter={() => handlePointerEnter(symbol.id)}
              onPointerLeave={handlePointerLeave}
              className={cn(
                "absolute z-overlay cursor-pointer w-size-5 h-size-5 rounded-full border-border-sm border-solid transition-all duration-300",
                DOT_POSITIONS[
                  (symbol.position as HotspotPosition) || "top-right"
                ],
                isActive
                  ? variant === "ambient"
                    ? "bg-gold-base border-gold-base ring-4 ring-gold-base/30 scale-125 shadow-md"
                    : "bg-gold-base border-gold-base ring-4 ring-gold-base/30 scale-110"
                  : isHovered && variant !== "ambient"
                  ? "bg-surface-elevated border-gold-base scale-125 shadow-md"
                  : "bg-surface-base border-border-default hover:border-gold-base"
              )}
            />
          );
        })}
      </Container>

      {/* ── Context Labels ── */}
      {symbols.map((symbol) => {
        const isActive = activeId === symbol.id;
        const isHovered = hoveredId === symbol.id;

        const isDimmed =
          activeId !== null && !isActive && (variant !== "click" || !isHovered);
        const isHighlighted = isActive || (variant !== "ambient" && isHovered);

        return (
          <button
            key={symbol.id}
            data-label={symbol.id}
            onClick={() => handleClick(symbol.id)}
            onPointerDown={() => handlePointerDown(symbol.id)}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => handlePointerEnter(symbol.id)}
            onPointerLeave={handlePointerLeave}
            className={cn(
              "absolute w-size-screen-w-20 text-center cursor-pointer bg-surface-elevated border-border-sm border-solid transition-all duration-300 z-dropdown rounded-md p-space-1p5",
              isDimmed
                ? "opacity-20 scale-95 grayscale"
                : "opacity-100 scale-100",
              isHighlighted
                ? "border-gold-base shadow-lg -translate-y-1"
                : "border-border-light shadow-sm",
              LABEL_POSITIONS[
                (symbol.position as HotspotPosition) || "top-right"
              ]
            )}
          >
            <EyebrowLabel
              className={cn(
                "transition-colors duration-fast block",
                isHighlighted ? "text-gold-base" : "text-text-muted"
              )}
            >
              {symbol.name}
            </EyebrowLabel>
            <Text
              variant="body-sm"
              color={isHighlighted ? "gold" : "muted"}
              className="mt-space-1 normal-case tracking-normal transition-colors duration-fast"
            >
              {symbol.meaning}
            </Text>
          </button>
        );
      })}
    </div>
  );
}
