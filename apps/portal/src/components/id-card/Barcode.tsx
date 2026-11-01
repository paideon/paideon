import { canEncodeCode128, code128Bars } from '@/lib/code128';

type Props = {
  value: string;
  /** Print the text under the bars. */
  showText?: boolean;
  className?: string;
};

// Code 128 as inline SVG. Stretches to the width of its container; the
// quiet zone (blank margin scanners need) is built in. Always black on
// white, whatever the theme, because scanners need the contrast.
export function Barcode({ value, showText = true, className }: Props) {
  if (!canEncodeCode128(value)) return null;

  const { bars, modules } = code128Bars(value);
  const quiet = 10;
  const total = modules + quiet * 2;
  const barHeight = 40;
  const textHeight = showText ? 14 : 0;

  return (
    <svg
      role="img"
      aria-label={`Barcode of ${value}`}
      viewBox={`0 0 ${total} ${barHeight + textHeight}`}
      preserveAspectRatio="none"
      className={className}
      style={{ background: '#fff', display: 'block', width: '100%' }}
      shapeRendering="crispEdges"
    >
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x + quiet}
          y={0}
          width={bar.width}
          height={barHeight}
          fill="#000"
        />
      ))}
      {showText && (
        <text
          x={total / 2}
          y={barHeight + 11}
          textAnchor="middle"
          fontFamily="'Courier New', monospace"
          fontSize={9}
          fill="#000"
        >
          {value}
        </text>
      )}
    </svg>
  );
}
