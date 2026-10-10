import { cn } from '../../utilities/cn';

type Axis = 'horizontal' | 'vertical';
type DividerAccentVariant = 'gold-accent' | 'gold-accent-narrow' | 'muted';

interface DividerProps {
  accentVariant?: DividerAccentVariant;
  axis?: Axis;
  className?: string;
}

// Width and height are kept separate so gold-accent-narrow can
// override width without fighting the axis class in twMerge.
const axisWidth: Record<Axis, string> = {
  horizontal: 'w-size-full',
  vertical: 'w-size-0p5',
};

const axisHeight: Record<Axis, string> = {
  horizontal: 'h-size-0p5',
  vertical: 'h-size-full',
};

const colorStyles: Record<DividerAccentVariant, string> = {
  'gold-accent': 'bg-gold-base',
  'gold-accent-narrow': 'bg-gold-base w-size-8', // overrides w-size-full via cn
  muted: 'bg-border-light',
};

const marginStyles: Record<Axis, string> = {
  horizontal: 'my-space-4',
  vertical: 'mx-space-4',
};

export function Divider({
  axis = 'horizontal',
  accentVariant = 'muted',
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        'border-none rounded-full',
        axisWidth[axis],
        axisHeight[axis],
        marginStyles[axis],
        colorStyles[accentVariant],
        className,
      )}
      role="separator"
      aria-orientation={axis}
    />
  );
}
