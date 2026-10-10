// packages/ui/src/components/layout/Stack.tsx
import { cn } from '../../utilities/cn';

type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
type StackSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type StackAs = 'div' | 'nav' | 'section' | 'ul' | 'ol';

const spacingMap: Record<StackSpacing, string> = {
  0: 'gap-space-0',
  1: 'gap-space-1',
  2: 'gap-space-2',
  3: 'gap-space-3',
  4: 'gap-space-4',
  5: 'gap-space-5',
  6: 'gap-space-6',
  7: 'gap-space-7',
  8: 'gap-space-8',
  9: 'gap-space-9',
  10: 'gap-space-10',
  11: 'gap-space-11',
  12: 'gap-space-12',
};

const alignMap: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

interface StackProps {
  children: React.ReactNode;
  spacing?: StackSpacing;
  align?: StackAlign;
  className?: string;
  as?: StackAs;
  justify?: StackJustify;
  wrap?: boolean;
}

export function VStack({
  children,
  spacing = 1,
  align = 'start',
  className,
  as: Tag = 'div',
  justify = 'start',
  wrap = false,
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex flex-col',
        spacingMap[spacing],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function HStack({
  children,
  spacing = 4,
  align = 'center',
  className,
  as: Tag = 'div',
  justify = 'start',
  wrap = false,
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex flex-row',
        spacingMap[spacing],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
