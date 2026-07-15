/**
 * Single GSAP entry point for client components.
 * GSAP + plugins are DYNAMICALLY imported so their ~130 KB never sits in the
 * boot-critical chunk (they cost real TBT/LCP on throttled mobile). Plugins
 * register once and the ONE site-wide easing family is installed on load.
 * Only ever import this from "use client" modules.
 */

import type { gsap as gsapCore } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import type { Flip as FlipType } from "gsap/Flip";

export type GsapBundle = {
  gsap: typeof gsapCore;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
  Flip: typeof FlipType;
};

let bundle: GsapBundle | null = null;
let pending: Promise<GsapBundle> | null = null;

export function initGsap(): Promise<GsapBundle> {
  if (pending) return pending;
  pending = (async () => {
    const [g, st, split, ease, flip] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("gsap/CustomEase"),
      import("gsap/Flip"),
    ]);
    const gsap = g.gsap;
    gsap.registerPlugin(
      st.ScrollTrigger,
      split.SplitText,
      ease.CustomEase,
      flip.Flip,
    );
    // cubic-bezier(0.22, 1, 0.36, 1) — the only easing family on the site
    ease.CustomEase.create("brand", "0.22, 1, 0.36, 1");
    bundle = {
      gsap,
      ScrollTrigger: st.ScrollTrigger,
      SplitText: split.SplitText,
      Flip: flip.Flip,
    };
    return bundle;
  })();
  return pending;
}

/**
 * Synchronous access for INTERACTION handlers (menu open, filter flip, …).
 * Returns null until initGsap() has resolved — callers must skip their
 * animation in that case (never block the interaction itself). The idle
 * warm-up in SmoothScroll/RevealManager makes null vanishingly rare.
 */
export function gsapNow(): GsapBundle | null {
  return bundle;
}

export const EASE = "brand";

/**
 * Defer non-critical motion setup off the hydration critical path.
 * Returns a cancel function.
 */
export function whenIdle(fn: () => void, timeout = 1500): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(fn, { timeout });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
