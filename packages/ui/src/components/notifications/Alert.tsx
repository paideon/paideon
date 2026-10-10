import { ReactNode } from 'react';

import { cn } from '../../utilities/cn';
import { Icon } from '../icons';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { bg: string; border: string; text: string; icon: ReactNode }
> = {
  info: {
    bg: 'bg-semantic-info-surface',
    border: 'border-semantic-info-base',
    text: 'text-semantic-info-base',
    icon: <Icon name="info" />,
  },
  success: {
    bg: 'bg-semantic-success-surface',
    border: 'border-semantic-success-base',
    text: 'text-semantic-success-base',
    icon: <Icon name="check-circle" />,
  },
  warning: {
    bg: 'bg-semantic-warning-surface',
    border: 'border-semantic-warning-base',
    text: 'text-semantic-warning-base',
    icon: <Icon name="alert-triangle" />,
  },
  error: {
    bg: 'bg-semantic-error-surface',
    border: 'border-semantic-error-base',
    text: 'text-semantic-error-base',
    icon: <Icon name="x-circle" />,
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  className,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'p-space-4 border-l-4 rounded-r-md',
        styles.bg,
        styles.border,
        className,
      )}
    >
      <div className="flex items-start gap-space-3">
        <span className={cn('flex-shrink-0 text-lg', styles.text)}>
          {icon || styles.icon}
        </span>
        <div>
          {title && (
            <h4
              className={cn(
                'font-display font-semibold mb-space-1',
                styles.text,
              )}
            >
              {title}
            </h4>
          )}
          <div className={cn('font-body text-body-sm', styles.text)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
