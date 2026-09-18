import clsx from "clsx";

import { ButtonLink } from "../atoms/ButtonLink";
import { ImageFrame } from "../media/ImageFrame";
import { QuoteBlock } from "../typography/QuoteBlock";

export interface LeaderMessageProps {
  name: string;
  title: string;
  tenure: string;
  portraitSrc: string;
  portraitAlt: string;
  message: string;
  quote?: string;
  fullMessageHref: string;
  fullMessageLabel?: string;
  className?: string;
}

export function LeaderMessage({
  name,
  title,
  tenure,
  portraitSrc,
  portraitAlt,
  message,
  quote,
  fullMessageHref,
  fullMessageLabel = "Read Full Message →",
  className,
}: LeaderMessageProps) {
  return (
    <div className={clsx("grid md:grid-cols-2 gap-12 items-center", className)}>
      {/* Portrait */}
      <div className="relative">
        <ImageFrame
          src={portraitSrc}
          alt={portraitAlt}
          aspectRatio="portrait"
          variant="standard"
          className="shadow-elevation-2"
        />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-base/10 rounded-full blur-2xl" />
      </div>

      {/* Message */}
      <div>
        <p className="font-body text-eyebrow uppercase tracking-wider text-gold-base mb-2">
          {title}
        </p>
        <h2 className="font-display text-h2">{name}</h2>
        <p className="font-body text-caption text-text-muted uppercase tracking-wider mb-6">
          {tenure}
        </p>

        <div className="w-size-12 h-size-0p5 bg-gold-base mb-space-6" />

        {quote && (
          <QuoteBlock
            variant="pull-quote"
            quote={quote}
            className="mb-space-6"
          />
        )}

        <p className="font-body text-body text-text-muted leading-relaxed mb-8">
          {message}
        </p>

        <ButtonLink href={fullMessageHref} variant="ghost">
          {fullMessageLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
