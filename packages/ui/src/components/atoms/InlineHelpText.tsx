// components/atoms/InlineHelpText.tsx
import { cn } from '../../utilities/cn';
import { Text } from '../typography/Text';
type Tone = 'default' | 'success' | 'error';

type Props = {
  id?: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
};

const tones: Record<Tone, string> = {
  default: 'text-text-muted',
  success: 'text-success-base',
  error: 'text-error-base',
};

export function InlineHelpText({
  id,
  tone = 'default',
  children,
  className,
}: Props) {
  return (
    <Text
      id={id}
      className={cn('font-body text-caption', tones[tone], className)}
    >
      {children}
    </Text>
  );
}

InlineHelpText.displayName = 'InlineHelpText';
