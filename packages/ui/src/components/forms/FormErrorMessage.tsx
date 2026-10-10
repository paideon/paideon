import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';

type Variant = 'error' | 'warning' | 'success';

type Props = {
  id?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  error: 'text-semantic-error-base',
  warning: 'text-semantic-warning-base',
  success: 'text-semantic-success-base',
};

export function FormErrorMessage({
  id,
  variant = 'error',
  children,
  className,
}: Props) {
  const isAssertive = variant === 'error';

  return (
    <p
      id={id}
      role={isAssertive ? 'alert' : undefined}
      aria-live={isAssertive ? undefined : 'polite'}
      className={cn(
        'font-body text-caption',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}

FormErrorMessage.displayName = 'FormErrorMessage';
