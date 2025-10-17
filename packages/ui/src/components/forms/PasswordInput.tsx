'use client';

import { useState, type ComponentProps } from 'react';

import { Icon } from '../icons/Icon';
import { Input } from './Input';

type Props = Omit<ComponentProps<typeof Input>, 'type' | 'endAdornment'> & {
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordInput({
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...rest}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="flex h-icon-lg w-icon-lg items-center justify-center rounded-sm text-text-muted transition-colors duration-fast hover:text-text-primary focus-visible:outline-2 focus-visible:outline-gold-base"
        >
          <Icon
            name={visible ? 'eye-off' : 'eye'}
            size="xs"
            aria-hidden="true"
          />
        </button>
      }
    />
  );
}

PasswordInput.displayName = 'PasswordInput';
