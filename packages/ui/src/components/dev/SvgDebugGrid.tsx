// packages/ui/src/components/dev/SvgDebugGrid.tsx
// Drop <SvgDebugGrid /> inside any <svg> to overlay a coordinate grid.
// Set show={false} (the default) to hide in production — zero DOM cost when hidden.

interface SvgDebugGridProps {
  /** viewBox width of the parent SVG */
  width?: number;
  /** viewBox height of the parent SVG */
  height?: number;
  /** Distance between grid lines in SVG units */
  step?: number;
  /** Stroke color. Accepts any CSS color or var(--token) */
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  /** Show major grid lines every N steps with a stronger stroke */
  majorEvery?: number;
  /** Render coordinate labels at major intersections */
  showLabels?: boolean;
  /** Master toggle — nothing renders when false */
  show?: boolean;
}

export function SvgDebugGrid({
  width = 480,
  height = 420,
  step = 10,
  color = 'var(--color-text-primary)',
  strokeWidth = 0.1,
  opacity = 1,
  majorEvery = 5,
  showLabels = true,
  show = true,
}: SvgDebugGridProps) {
  if (!show) return null;

  const verticalLines = Math.floor(width / step);
  const horizontalLines = Math.floor(height / step);

  return (
    <g opacity={opacity} aria-hidden>
      {/* Vertical lines */}
      {Array.from({ length: verticalLines + 1 }).map((_, i) => {
        const x = i * step;
        const isMajor = i % majorEvery === 0;
        return (
          <line
            key={`v-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={color}
            strokeWidth={isMajor ? strokeWidth * 2 : strokeWidth}
          />
        );
      })}

      {/* Horizontal lines */}
      {Array.from({ length: horizontalLines + 1 }).map((_, i) => {
        const y = i * step;
        const isMajor = i % majorEvery === 0;
        return (
          <line
            key={`h-${i}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeWidth={isMajor ? strokeWidth * 2 : strokeWidth}
          />
        );
      })}

      {/* Coordinate labels at major intersections */}
      {showLabels &&
        Array.from({ length: Math.floor(verticalLines / majorEvery) + 1 }).map(
          (_, xi) =>
            Array.from({
              length: Math.floor(horizontalLines / majorEvery) + 1,
            }).map((_, yi) => {
              const x = xi * step * majorEvery;
              const y = yi * step * majorEvery;
              if (x === 0 && y === 0) return null;
              return (
                <text
                  key={`label-${x}-${y}`}
                  x={x + 2}
                  y={y - 2}
                  fontSize={2}
                  fill={color}
                  fontFamily="monospace"
                >
                  {x},{y}
                </text>
              );
            }),
        )}
    </g>
  );
}
