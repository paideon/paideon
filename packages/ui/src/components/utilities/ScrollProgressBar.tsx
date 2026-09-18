"use client";

import { useEffect, useState } from "react";

import { cn } from "../../utilities/cn";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render at 0% (avoids a zero-width bar)
  if (progress <= 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "fixed top-0 left-0 right-0 z-[201]",
        "h-size-0p5 bg-gold-base/20",
        "transition-all duration-fast ease-out motion-reduce:transition-none"
      )}
    >
      <div
        className="h-size-full bg-gold-base"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
