"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Site-wide Lenis smooth scrolling, driving GSAP ScrollTrigger from its raf.
 * Skipped entirely under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = initGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
