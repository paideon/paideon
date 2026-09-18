"use client";
import { useState, useRef, useCallback } from "react";

import { cn } from "../../utilities/cn";

export interface FileUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  onChange?: (files: File[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Leading drag-drop phrase. Defaults to a multiple-aware English string. */
  dragDropText?: string;
  browseLabel?: string;
  /** Max-size caption builder, receives the MB value */
  getMaxSizeLabel?: (mb: number) => string;
  /** aria-label builder for each remove-file button, receives the filename */
  getRemoveLabel?: (filename: string) => string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadZone({
  accept,
  multiple = false,
  maxSizeMb,
  onChange,
  label = "Upload file",
  hint,
  error: externalError,
  disabled = false,
  dragDropText,
  browseLabel = "browse",
  getMaxSizeLabel = (mb) => `Max ${mb} MB`,
  getRemoveLabel = (filename) => `Remove ${filename}`,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [internalError, setInternalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError ?? internalError;

  const processFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      setInternalError(null);

      const arr = Array.from(incoming);

      if (maxSizeMb) {
        const oversized = arr.filter((f) => f.size > maxSizeMb * 1024 * 1024);
        if (oversized.length > 0) {
          setInternalError(
            `${oversized[0].name} exceeds the ${maxSizeMb} MB limit.`
          );
          return;
        }
      }

      const next = multiple ? [...files, ...arr] : arr;
      setFiles(next);
      onChange?.(next);
    },
    [files, maxSizeMb, multiple, onChange]
  );

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange?.(next);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) processFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {label && (
        <p className="font-body text-label uppercase tracking-caption text-text-primary mb-space-2">
          {label}
        </p>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${label}. Click or drag files here.`}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled)
            inputRef.current?.click();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-space-2 p-space-9",
          "border-2 border-dashed transition-all duration-fast",
          error
            ? "border-semantic-error-base bg-semantic-error-surface"
            : isDragging
            ? "border-gold-base bg-gold-pale"
            : "border-border-default bg-surface-elevated",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className="text-gold-base text-[1.75rem] leading-none"
        >
          ↑
        </span>
        <span className="font-body text-body-sm text-text-primary text-center">
          {dragDropText ??
            `Drag & drop${multiple ? " files" : " a file"} here, or `}
          <span className="text-gold-base underline">{browseLabel}</span>
        </span>
        {hint && (
          <span className="font-body text-caption text-text-muted text-center">
            {hint}
          </span>
        )}
        {maxSizeMb && (
          <span className="font-body text-caption text-text-muted">
            {getMaxSizeLabel(maxSizeMb)}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />

      {error && (
        <p
          role="alert"
          className="font-body text-caption text-semantic-error-base mt-space-1.5"
        >
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="list-none p-0 m-0 mt-space-2.5 flex flex-col gap-space-1.5">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between gap-space-3 p-space-2.5 bg-surface-default border border-border-light"
            >
              <div className="flex items-center gap-space-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className="text-semantic-success-base text-sm flex-shrink-0"
                >
                  ✓
                </span>
                <span className="font-body text-body-sm text-text-primary truncate">
                  {file.name}
                </span>
                <span className="font-body text-caption text-text-muted flex-shrink-0">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                onClick={() => removeFile(idx)}
                aria-label={getRemoveLabel(file.name)}
                className="bg-transparent border-none cursor-pointer text-text-muted text-base p-1 leading-none transition-colors duration-fast hover:text-semantic-error-base"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
