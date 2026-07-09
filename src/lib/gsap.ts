/**
 * Single GSAP entry point for client components.
 * Registers plugins once and installs the ONE site-wide easing family.
 * Only ever import this from "use client" modules.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";

let registered = false;

export function initGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);
    // cubic-bezier(0.22, 1, 0.36, 1) — the only easing family on the site
    CustomEase.create("brand", "0.22, 1, 0.36, 1");
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText, Flip };
}

export const EASE = "brand";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
