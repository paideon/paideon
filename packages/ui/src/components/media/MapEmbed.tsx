'use client';

import { clsx } from 'clsx';

export interface MapEmbedProps {
  src: string;
  title: string;
  className?: string;
  nearbyNote?: string;
}

export function MapEmbed({ src, title, className, nearbyNote }: MapEmbedProps) {
  return (
    <div
      className={clsx(
        'bg-surface-elevated border border-border-light rounded-lg overflow-hidden',
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        className="w-full h-[300px] md:h-[400px] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {nearbyNote && (
        <div className="p-4 border-t border-border-light">
          <p className="font-body text-caption text-text-muted text-center">
            {nearbyNote}
          </p>
        </div>
      )}
    </div>
  );
}
