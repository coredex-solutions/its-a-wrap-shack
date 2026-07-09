"use client";

import { useEffect, useRef, useState } from "react";
import { getTestimonials } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Two-to-three curated quotes, large Cormorant, subtle auto-advance.
 * Pauses on hover/focus; never auto-advances under reduced motion.
 */
export default function Testimonials() {
  const quotes = getTestimonials();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 6500);
    return () => clearInterval(t);
  }, [paused, quotes.length]);

  return (
    <section aria-label="What people say" className="grain bg-cream">
      <div
        ref={regionRef}
        className="mx-auto max-w-[880px] px-5 py-24 text-center md:px-10 md:py-32"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <p className="eyebrow text-gold-ink" data-reveal>
          From the counter
        </p>

        <div className="relative mt-10 min-h-[220px] md:min-h-[190px]" data-reveal>
          {quotes.map((q, i) => (
            <blockquote
              key={q.id}
              aria-hidden={i !== index}
              className={[
                "absolute inset-0 transition-opacity duration-700 ease-brand",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              ].join(" ")}
            >
              <p className="font-display text-[clamp(1.5rem,2.7vw,2.2rem)] font-medium italic leading-[1.4] text-charcoal">
                &ldquo;{q.quote}&rdquo;
              </p>
              <footer className="eyebrow mt-7 text-charcoal-60">
                {q.attribution}
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3" data-reveal>
          {quotes.map((q, i) => (
            <button
              key={q.id}
              type="button"
              aria-label={`Show quote ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={[
                "h-[7px] w-[7px] rounded-full transition-[background-color,transform] duration-250 ease-brand",
                i === index ? "scale-110 bg-gold-ink" : "bg-tahini hover:bg-sand",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
