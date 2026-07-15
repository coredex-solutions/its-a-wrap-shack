"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { initGsap, gsapNow, prefersReducedMotion, whenIdle } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Site-wide Lenis smooth scrolling, driving GSAP ScrollTrigger from its raf.
 * Skipped entirely under prefers-reduced-motion; started off the hydration
 * critical path (native scroll covers the first few hundred ms).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let cancelled = false;

    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await initGsap();
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    });

    return () => {
      cancelled = true;
      cancel();
      if (raf) gsapNow()?.gsap.ticker.remove(raf);
      setLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
