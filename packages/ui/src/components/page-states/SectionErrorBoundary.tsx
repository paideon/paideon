"use client";

import { Component, type ReactNode, useCallback, useState } from "react";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
  /** Defaults to `The {sectionName} section encountered an error. Please try refreshing the page.` */
  message?: string;
  retryLabel?: string;
}

interface ErrorBoundaryClassProps {
  children: ReactNode;
  onError: (error: Error) => void;
}

interface ErrorBoundaryClassState {
  hasError: boolean;
}

// A real error boundary — this has to be a class component. There is no hook
// equivalent of getDerivedStateFromError/componentDidCatch in React (19
// included); a try/catch wrapped around `return <>{children}</>` in a
// function component only catches errors thrown while constructing that JSX
// element, which essentially never happens — it does not catch errors thrown
// while React actually renders or commits the child tree, so the previous
// version of this file never caught anything from real component errors.
class ErrorBoundaryClass extends Component<
  ErrorBoundaryClassProps,
  ErrorBoundaryClassState
> {
  override state: ErrorBoundaryClassState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  override render() {
    // Parent (SectionErrorBoundary) owns the actual fallback UI, so just
    // render nothing here once an error has been caught and reported up.
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function SectionErrorBoundary({
  children,
  sectionName,
  fallback,
  message,
  retryLabel = "Try Again",
}: SectionErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleError = useCallback(() => setHasError(true), []);

  const resetError = useCallback(() => {
    setHasError(false);
    // Force the class boundary to remount so its internal hasError state resets
    setResetKey((k) => k + 1);
  }, []);

  if (hasError) {
    return (
      fallback ?? (
        <section className="py-space-12 px-space-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-body text-body-sm text-text-muted">
              {message ??
                `The ${sectionName} section encountered an error. Please try refreshing the page.`}
            </p>
            <button
              onClick={resetError}
              className="mt-space-4 px-space-4 py-space-2 bg-green-base text-text-inverse font-body text-caption uppercase tracking-caption hover:bg-green-hover transition-colors"
            >
              {retryLabel}
            </button>
          </div>
        </section>
      )
    );
  }

  return (
    <ErrorBoundaryClass key={resetKey} onError={handleError}>
      {children}
    </ErrorBoundaryClass>
  );
}
