'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useFormField } from '../../hooks/useFormField';
import { cn } from '../../utilities/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Smaller text after the label, e.g. "32 students". */
  hint?: string;
}

export interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  /** The chosen option's value, or null for none. */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  /** Text shown when typing matches nothing. */
  emptyMessage?: string;
  /** Lets the person clear the choice. */
  clearable?: boolean;
  className?: string;
  name?: string;
}

// A field you can type into to narrow a long list, then pick from. Arrow keys
// move through the list, Enter picks, Escape closes.
export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  emptyMessage = 'Nothing matches.',
  clearable = true,
  className,
  name,
}: ComboboxProps) {
  const { id, errorId, helperId, hasError, describedBy } = useFormField({
    error,
    helperText,
  });
  const listId = `${id}-list`;
  const selected = options.find((option) => option.value === value) ?? null;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      `${option.label} ${option.hint ?? ''}`.toLowerCase().includes(needle),
    );
  }, [options, query]);

  // Close when focus or a click lands outside.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const choose = (option: ComboboxOption) => {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      setActive((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      const option = visible[active];
      if (option) choose(option);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setQuery('');
    }
  };

  const shown = open ? query : (selected?.label ?? '');

  return (
    <div ref={rootRef} className={cn('flex flex-col gap-space-2', className)}>
      <label
        htmlFor={id}
        className="font-body text-label text-text-primary uppercase tracking-label"
      >
        {label}
        {required && (
          <span
            className="ml-space-1 text-semantic-error-base"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && visible[active] ? `${id}-opt-${active}` : undefined
          }
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          disabled={disabled}
          value={shown}
          placeholder={selected && open ? selected.label : placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'w-full font-body text-body text-text-primary bg-surface-elevated border rounded-sm px-space-4 py-space-3 pr-space-10',
            'transition-all duration-fast ease-snap placeholder:text-text-muted',
            'disabled:bg-surface-deep disabled:text-text-muted disabled:cursor-not-allowed',
            'focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]',
            hasError
              ? 'border-semantic-error-base focus-visible:outline-semantic-error-base'
              : 'border-border-default focus-visible:border-gold-base',
          )}
        />
        {clearable && selected && !disabled && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              onChange(null);
              setQuery('');
            }}
            className="absolute inset-y-0 right-space-3 flex items-center px-space-1 text-text-muted hover:text-text-primary"
          >
            ×
          </button>
        )}
        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="absolute z-raised mt-space-1 max-h-60 w-full overflow-auto rounded-sm border border-border-default bg-surface-elevated shadow-elevation-2"
          >
            {visible.length === 0 ? (
              <li className="px-space-4 py-space-3 font-body text-body-sm text-text-muted">
                {emptyMessage}
              </li>
            ) : (
              visible.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id}-opt-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onPointerMove={() => setActive(index)}
                  className={cn(
                    'flex cursor-pointer items-baseline justify-between gap-space-3 px-space-4 py-space-2 font-body text-body-sm',
                    index === active ? 'bg-surface-deep' : '',
                    option.value === value && 'font-medium text-gold-base',
                  )}
                >
                  <span>{option.label}</span>
                  {option.hint && (
                    <span className="text-caption text-text-muted">
                      {option.hint}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {hasError && (
        <p
          id={errorId}
          className="font-body text-caption text-semantic-error-base"
          role="alert"
        >
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={helperId} className="font-body text-caption text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

Combobox.displayName = 'Combobox';
