"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The ONE parallax moment outside the hero (story section imagery drifting
 * at 0.9× scroll speed). Do not use anywhere else.
 */
export default function ParallaxImage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    const { gsap } = initGsap();
    const tween = gsap.fromTo(
      inner,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      {/* oversized so the drift never reveals edges */}
      <div ref={innerRef} className="relative h-[112%] w-full [margin-top:-6%]">
        {children}
      </div>
    </div>
  );
}
