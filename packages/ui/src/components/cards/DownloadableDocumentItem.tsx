"use client";

import { cn } from "../../utilities/cn";
import { ButtonLink } from "../atoms/ButtonLink";

type FileTypes = "pdf" | "doc" | "xls" | "zip";
export interface DownloadableDocumentItemProps {
  title: string;
  fileType: FileTypes;
  fileSize: string; // e.g., "2.4 MB"
  url: string;
  description?: string;
  className?: string;
  downloadLabel?: string;
}

const fileIconMap = {
  pdf: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-4M9 16h6" />
    </svg>
  ),
  doc: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 12h8M8 16h6" />
    </svg>
  ),
  xls: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 12h8M8 16h8" />
    </svg>
  ),
  zip: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 12v4M9 14h6" />
    </svg>
  ),
};

export function DownloadableDocumentItem({
  title,
  fileType,
  fileSize,
  url,
  description,
  className,
  downloadLabel = "Download",
}: DownloadableDocumentItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 bg-surface-default border border-border-light rounded-md",
        className
      )}
    >
      <div className="text-gold-base shrink-0">{fileIconMap[fileType]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-body font-semibold text-text-primary">{title}</h4>
        {description && (
          <p className="font-body text-sm text-text-muted mt-1">
            {description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="font-body text-caption uppercase text-text-muted">
            {fileType.toUpperCase()}
          </span>
          <span className="font-body text-caption text-text-muted">
            {fileSize}
          </span>
        </div>
      </div>
      <ButtonLink href={url} variant="secondary" size="sm" download>
        {downloadLabel}
      </ButtonLink>
    </div>
  );
}
