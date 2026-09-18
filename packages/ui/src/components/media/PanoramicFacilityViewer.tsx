"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

import { cn } from "../../utilities/cn";

export interface PanoramicFacilityViewerProps {
  images: { src: string; alt: string; label?: string }[];
  defaultIndex?: number;
  className?: string;
  dragHintLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function PanoramicFacilityViewer({
  images,
  defaultIndex = 0,
  className,
  dragHintLabel = "Drag to explore",
  prevLabel = "Previous",
  nextLabel = "Next",
}: PanoramicFacilityViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [panX, setPanX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    setPanX(0);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    setPanX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - panX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPanX = e.clientX - startX;
    const maxPan = 100;
    setPanX(Math.min(maxPan, Math.max(-maxPan, newPanX)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(panX) > 50) {
      if (panX > 0) prev();
      else next();
    } else {
      setPanX(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[16/9] bg-surface-deep cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative w-[120%] h-full transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${panX}px)` }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-cover"
            draggable={false}
          />
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-overlay-medium to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-overlay-medium to-transparent pointer-events-none" />
        {currentImage.label && (
          <div className="absolute bottom-space-4 left-space-4 bg-surface-inverse/80 text-text-inverse px-space-3 py-space-1 rounded-full font-body text-body-sm">
            {currentImage.label}
          </div>
        )}
        {!isDragging && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-inverse/60 text-text-inverse px-space-3 py-space-1 rounded-full font-body text-caption opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            {dragHintLabel}
          </div>
        )}
      </div>

      {totalImages > 1 && (
        <div className="flex gap-space-2 mt-space-3 overflow-x-auto pb-space-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-20 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all",
                idx === currentIndex && "ring-2 ring-gold-base"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {totalImages > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-space-4 top-1/2 -translate-y-1/2 bg-surface-elevated/80 rounded-full p-space-2 hover:bg-gold-base transition-colors"
            aria-label={prevLabel}
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-space-4 top-1/2 -translate-y-1/2 bg-surface-elevated/80 rounded-full p-space-2 hover:bg-gold-base transition-colors"
            aria-label={nextLabel}
          >
            →
          </button>
          <div className="absolute bottom-space-4 right-space-4 bg-surface-inverse/80 text-text-inverse px-space-2 py-space-1 rounded-full font-body text-caption">
            {currentIndex + 1} / {totalImages}
          </div>
        </>
      )}
    </div>
  );
}
