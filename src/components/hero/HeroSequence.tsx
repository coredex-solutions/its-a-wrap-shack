"use client";

import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import { getCloverUrl } from "@/lib/content";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The site's signature: a pinned, scroll-scrubbed canvas playback of the
 * hero frame sequence (never `<video>.currentTime` — h264 seeking is jumpy).
 *
 * - Poster (frame 1) renders via next/image `priority` → it is the LCP.
 * - Frames preload progressively: every 5th first, then backfill; decoded
 *   with createImageBitmap where supported. No loader UI — the poster covers.
 * - `sm` set on small viewports / Save-Data. Pin: 300vh desktop, 150vh touch.
 * - Frames are rendered procedurally from real assets (scripts/hero-render.js):
 *   parsley and peppercorns converge while the kraft wrap rises and settles
 *   under steam. The sequence is clean end-to-end, so the scrub uses the full
 *   range; the final hold crossfades to a cream DOM overlay with the REAL logo.
 * - prefers-reduced-motion: no pin, no scrub — a static wrap still (art-
 *   directed via <picture>) with the same overlay content.
 */

const SETS = {
  lg: { dir: "lg", end: 150, native: 150 },
  sm: { dir: "sm", end: 80, native: 80 },
} as const;

const HERO_ALT =
  "A chicken shawarma wrap in kraft paper, floating over a deep green studio haze";

export default function HeroSequence() {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const clover = getCloverUrl();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const pinEl = pinRef.current;
    const canvas = canvasRef.current;
    if (!pinEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { gsap, ScrollTrigger } = initGsap();

    const small = window.matchMedia("(max-width: 767px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    const cfg = small || saveData ? SETS.sm : SETS.lg;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const pinVh = touch ? 150 : 300; // shorter scrub on touch — less scroll to clear the hero

    let disposed = false;
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(
      cfg.end,
    ).fill(null);
    const srcOf = (i: number) =>
      `/hero-frames/${cfg.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;

    async function loadFrame(i: number): Promise<void> {
      if (frames[i] || disposed) return;
      try {
        if (typeof createImageBitmap === "function") {
          const blob = await (await fetch(srcOf(i))).blob();
          if (disposed) return;
          frames[i] = await createImageBitmap(blob);
        } else {
          frames[i] = await new Promise<HTMLImageElement>((res, rej) => {
            const img = new window.Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = srcOf(i);
          });
        }
      } catch {
        /* missing frame — nearest-neighbor draw covers it */
      }
    }

    /** Nearest loaded frame to `target` (scan outward — the set is small). */
    function nearestLoaded(target: number): number {
      if (frames[target]) return target;
      for (let d = 1; d < cfg.end; d++) {
        if (target - d >= 0 && frames[target - d]) return target - d;
        if (target + d < cfg.end && frames[target + d]) return target + d;
      }
      return -1;
    }

    let lastDrawn = -1;
    const state = { frame: 0 };

    function draw(target: number, force = false) {
      const idx = nearestLoaded(Math.max(0, Math.min(cfg.end - 1, target)));
      if (idx < 0 || (idx === lastDrawn && !force)) return;
      const img = frames[idx]!;
      lastDrawn = idx;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const iw = img.width;
      const ih = img.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = pinEl!;
      canvas!.width = Math.round(clientWidth * dpr);
      canvas!.height = Math.round(clientHeight * dpr);
      draw(Math.round(state.frame), true);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(pinEl);
    resize();

    // ——— progressive preload: every 5th frame, then backfill in batches ———
    // Deferred until the window has loaded and the main thread is idle (or
    // the user starts scrolling) so hydration isn't fighting 70+ fetches;
    // the poster is the LCP and covers the gap.
    (async () => {
      await new Promise<void>((resolve) => {
        let done = false;
        const go = () => {
          if (done) return;
          done = true;
          resolve();
        };
        window.addEventListener("scroll", go, { once: true, passive: true });
        const idle = () => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(go, { timeout: 2500 });
          } else {
            setTimeout(go, 400);
          }
        };
        if (document.readyState === "complete") idle();
        else window.addEventListener("load", idle, { once: true });
      });
      if (disposed) return;
      const coarse: Promise<void>[] = [];
      for (let i = 0; i < cfg.end; i += 5) coarse.push(loadFrame(i));
      coarse.push(loadFrame(cfg.end - 1));
      await Promise.all(coarse);
      if (disposed) return;
      draw(Math.round(state.frame), true);
      setCanvasReady(true);
      for (let i = 0; i < cfg.end; i += 6) {
        if (disposed) return;
        await Promise.all(
          Array.from({ length: 6 }, (_, k) => i + k)
            .filter((j) => j < cfg.end)
            .map((j) => loadFrame(j)),
        );
      }
      if (!disposed) draw(Math.round(state.frame), true);
    })();

    // ——— the scrub timeline ———
    let creamPhase = false;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pinEl,
        start: "top top",
        end: `+=${pinVh}%`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // once the cream end-field is fading in, the transparent header's
          // cream ink would vanish — tell it to go solid
          const solid = self.progress > 0.86;
          if (solid !== creamPhase) {
            creamPhase = solid;
            window.dispatchEvent(
              new CustomEvent("hero:creamphase", { detail: { solid } }),
            );
          }
        },
      },
    });

    // full frame range across the scrub
    tl.to(
      state,
      {
        frame: cfg.end - 1,
        duration: 1,
        onUpdate: () => draw(Math.round(state.frame)),
      },
      0,
    );

    // 0–15%: intro overlay rises out; scroll cue gone by 5%
    if (cueRef.current) tl.to(cueRef.current, { opacity: 0, duration: 0.04 }, 0.01);
    if (introRef.current)
      tl.fromTo(
        introRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -48, duration: 0.09, immediateRender: false },
        0.055,
      );

    // ~45%: italic caption drifts through
    if (captionRef.current) {
      tl.fromTo(
        captionRef.current,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.06 },
        0.40,
      ).to(captionRef.current, { opacity: 0, y: -18, duration: 0.06 }, 0.53);
    }

    // 86–100%: cream field fades up first, then the REAL logo lands on it
    if (endRef.current) {
      tl.fromTo(endRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.86);
      const logo = endRef.current.querySelector("img");
      if (logo)
        tl.fromTo(
          logo,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.07 },
          0.92,
        );
    }

    // (the intro entrance is a CSS animation — see .hero-enter — so the
    // headline paints before hydration and stays the fastest LCP candidate;
    // triggers created before this pin recalibrate on ScrollTrigger's own
    // window-load refresh)

    return () => {
      disposed = true;
      ro.disconnect();
      tl.scrollTrigger?.kill();
      tl.kill();
      frames.forEach((f) => {
        if (f && "close" in f) (f as ImageBitmap).close();
      });
    };
  }, []);

  // Art-directed hero image: poster (frame 1) is the LCP; reduced-motion
  // users get the wrap still instead — single request either way.
  const common = { alt: HERO_ALT, width: 1280, height: 720, sizes: "100vw" };
  const { props: staticProps } = getImageProps({
    ...common,
    src: "/images/hero-static.webp",
  });
  const { props: posterProps } = getImageProps({
    ...common,
    src: "/hero-frames/hero-poster.webp",
    priority: true,
  });

  return (
    <section aria-label="Welcome to The Wrap Shack">
      <div ref={pinRef} className="relative h-svh overflow-hidden bg-forest">
        {/* LCP poster / reduced-motion still */}
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={staticProps.srcSet}
            sizes="100vw"
          />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes via posterProps */}
          <img
            {...posterProps}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {/* the scrub canvas fades in over the poster once coarse frames exist */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            canvasReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* reduced-motion only: extra scrim so overlay text stays legible
            against the light wrap in the static still */}
        <div
          aria-hidden
          className="absolute inset-0 hidden motion-reduce:block"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 55%, rgba(22,41,31,0.55) 0%, rgba(22,41,31,0.25) 60%, rgba(22,41,31,0.1) 100%)",
          }}
        />

        {/* warm vignette — the one permitted gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 42%, rgba(196,161,107,0.10) 0%, rgba(22,41,31,0.18) 62%, rgba(22,41,31,0.42) 100%)",
          }}
        />

        {/* intro overlay — visible 0–15% of scrub */}
        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="eyebrow hero-enter mb-6 text-tahini">
            Palm Desert · 100% Halal
          </p>
          <h1
            className="display-hero hero-enter text-cream"
            style={{ animationDelay: "0.12s" }}
          >
            <span className="block">Lebanese soul.</span>
            <span className="block italic">California sun.</span>
          </h1>
          <div className="hero-enter mt-10" style={{ animationDelay: "0.24s" }}>
            <a
              href={clover}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
            >
              Order on Clover
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* mid-scrub caption (~45%) — hidden entirely under reduced motion */}
        <p
          ref={captionRef}
          aria-hidden
          className="absolute inset-x-0 top-[68%] z-10 px-6 text-center font-display text-[clamp(1.6rem,3vw,2.4rem)] italic text-cream opacity-0 motion-reduce:hidden"
        >
          wrapped fresh, every single day
        </p>

        {/* final hold: cream field + the real logo (the video's own logo
            ending is a garbled AI rendition — never shown) */}
        <div
          ref={endRef}
          aria-hidden
          className="absolute inset-0 z-20 flex items-center justify-center bg-cream opacity-0 motion-reduce:hidden"
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={420}
            height={337}
            className="h-auto w-[min(58vw,380px)]"
          />
        </div>

        {/* scroll cue — gone by 5% */}
        <div
          ref={cueRef}
          aria-hidden
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 motion-reduce:hidden"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/70">
            Scroll
          </span>
          <span className="block h-12 w-px bg-cream/50" />
        </div>
      </div>

      {/* header watches this to flip from transparent to solid */}
      <div data-hero-sentinel aria-hidden className="h-px" />
    </section>
  );
}
