"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Drive Lenis through GSAP ticker exclusively ───────────────
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // ── Scroll-driven tilt + pin ───────────────────────────────────
  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("section");

      sections.forEach((section, index) => {
        const container = section.querySelector<HTMLElement>(
          "[data-scroll-container]",
        );
        if (!container) return;

        gsap.from(container, {
          rotation: 30,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
          },
        });

        if (index === sections.length - 1) return;

        ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });
      });

      // Force ScrollTrigger to remeasure the page after setup
      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  return (
    // autoRaf: false — GSAP ticker drives Lenis, not its own loop
    <ReactLenis ref={lenisRef} root options={{ autoRaf: false }}>
      <div ref={containerRef}>{children}</div>
    </ReactLenis>
  );
}
