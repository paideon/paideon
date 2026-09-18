"use client";

import type { LightboxImageData } from "@paideon/contracts";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

export type LightboxImage = LightboxImageData;

export interface LightboxProps {
  images: LightboxImageData[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  closeLabel = "Close lightbox",
  prevLabel = "Previous image",
  nextLabel = "Next image",
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (!mounted || !isOpen) return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div className="fixed inset-0 z-modal bg-overlay-heavy flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-space-4 right-space-4 text-text-inverse hover:text-gold-base transition-colors z-10 p-space-2"
        aria-label={closeLabel}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-space-4 top-1/2 -translate-y-1/2 text-text-inverse hover:text-gold-base transition-colors p-space-2"
            aria-label={prevLabel}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-space-4 top-1/2 -translate-y-1/2 text-text-inverse hover:text-gold-base transition-colors p-space-2"
            aria-label={nextLabel}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <div className="max-w-[90vw] max-h-[85vh] relative">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[85vh] object-contain"
        />
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-overlay-medium text-text-inverse p-space-3 text-center">
            <p className="font-body text-body-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-space-4 left-1/2 -translate-x-1/2 bg-surface-inverse/80 text-text-inverse px-space-3 py-space-1 rounded-full font-body text-caption">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body
  );
}
