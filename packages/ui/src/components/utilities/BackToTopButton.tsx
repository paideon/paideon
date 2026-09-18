"use client";

import { useEffect, useState } from "react";

import { Button } from "../atoms/Button";
import { Icon } from "../icons";

export function BackToTopButton({
  ariaLabel = "Back to top",
}: { ariaLabel?: string } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5; // 50% of viewport

      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon-md"
      variant="secondary"
      className="fixed bottom-space-6 right-space-6 z-raised shadow-lg rounded-full w-size-12 h-size-12 p-space-0"
      aria-label={ariaLabel}
    >
      <Icon name="chevron-up" />
    </Button>
  );
}
