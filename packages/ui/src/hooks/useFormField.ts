// hooks/useFormField.ts
import { useId } from 'react';

type Options = {
  error?: string;
  helperText?: string;
};

export function useFormField({ error, helperText }: Options) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const hasError = Boolean(error);
  const describedBy =
    [hasError && errorId, !hasError && helperText && helperId]
      .filter(Boolean)
      .join(' ') || undefined;

  return { id, errorId, helperId, hasError, describedBy };
}
