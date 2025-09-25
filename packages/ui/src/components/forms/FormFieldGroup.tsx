import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';

type Props = {
  children: ReactNode;
  as?: 'div' | 'fieldset';
  legend?: ReactNode;
  className?: string;
};

export function FormFieldGroup({
  children,
  as: Tag = 'div',
  legend,
  className,
}: Props) {
  return (
    <Tag className={cn('flex flex-col gap-space-6', className)}>
      {Tag === 'fieldset' && legend && (
        <legend className="font-body text-eyebrow uppercase tracking-eyebrow text-gold-base select-none">
          {legend}
        </legend>
      )}
      {children}
    </Tag>
  );
}

FormFieldGroup.displayName = 'FormFieldGroup';
