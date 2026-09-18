import { type Ref } from "react";

import { cn } from "../../utilities/cn";

type QuoteBlockVariant = "pull-quote" | "ceremonial";

interface QuoteBlockProps {
  variant?: QuoteBlockVariant;
  quote: string;
  attribution?: string;
  className?: string;
  /** Optional URL source for the quote (adds cite attribute to blockquote) */
  cite?: string;
  ref?: Ref<HTMLElement>;
}

export const QuoteBlock = ({
  variant = "pull-quote",
  quote,
  attribution,
  className,
  cite,
  ref,
}: QuoteBlockProps) => {
  if (variant === "ceremonial") {
    return (
      <figure
        ref={ref as React.LegacyRef<HTMLQuoteElement>}
        className={cn(
          "text-center py-space-6 px-space-10 mx-auto max-w-prose",
          className
        )}
      >
        <blockquote className="m-0">
          <p className="font-display text-pullquote italic text-text-primary">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        {attribution && (
          <>
            <div className="w-size-8 h-size-px bg-gold-base my-space-5 mx-auto" />
            <figcaption className="font-body text-caption uppercase tracking-caption text-text-muted">
              {attribution}
            </figcaption>
          </>
        )}
      </figure>
    );
  }

  // Pull quote (default)
  return (
    <blockquote
      ref={ref as React.LegacyRef<HTMLQuoteElement>}
      cite={cite}
      className={cn(
        "m-0 py-space-1 pl-space-6 border-l-2 border-gold-base",
        className
      )}
    >
      <p className="font-display text-pullquote italic text-text-muted leading-relaxed tracking-wide">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <cite className="block mt-space-3 font-body text-caption uppercase tracking-caption text-gold-base not-italic">
          {attribution}
        </cite>
      )}
    </blockquote>
  );
};

QuoteBlock.displayName = "QuoteBlock";
