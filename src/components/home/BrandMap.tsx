import { getSite } from "@/lib/content";

/**
 * Hand-styled static map in the brand's illustration language — links out to
 * Google Maps (the brief forbids loading the Maps JS SDK; a keyed static-map
 * API would add a dependency for less character).
 */
export default function BrandMap({ className = "" }: { className?: string }) {
  const site = getSite();
  return (
    <a
      href={site.mapsUrl}
      target="_blank"
      rel="noopener"
      aria-label="Open our location in Google Maps — 40100 Washington St, Bermuda Dunes"
      className={`group block overflow-hidden rounded-[14px] border border-tahini bg-garlic ${className}`}
    >
      {/* Geometry matches reality (OSM): heading south on Washington St you
          cross I-10, reach the shop (40100 block), THEN Country Club Dr, and
          42nd Ave further south — the shop sits between I-10 and Country Club. */}
      <svg viewBox="0 0 640 480" className="h-full w-full" role="img" aria-hidden>
        {/* field */}
        <rect width="640" height="480" fill="var(--color-garlic)" />

        {/* I-10 — double band across the top (north) */}
        <path d="M-10 78 C 140 56, 320 50, 650 28" fill="none" stroke="var(--color-tahini)" strokeWidth="14" />
        <path d="M-10 78 C 140 56, 320 50, 650 28" fill="none" stroke="var(--color-garlic)" strokeWidth="2" strokeDasharray="10 12" />
        <text x="52" y="52" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(-5 52 52)">INTERSTATE 10</text>

        {/* Washington St — the spine */}
        <path d="M300 -10 C 306 140, 302 330, 310 490" fill="none" stroke="var(--color-olive)" strokeWidth="6" opacity="0.85" />
        <text x="322" y="365" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(87 322 345)">WASHINGTON ST</text>

        {/* cross streets — Country Club Dr first, 42nd Ave south of it */}
        <path d="M-10 330 C 180 322, 460 334, 650 326" fill="none" stroke="var(--color-tahini)" strokeWidth="4" />
        <text x="36" y="318" fill="var(--color-charcoal-60)" fontSize="11" fontWeight="600" letterSpacing="2">COUNTRY CLUB DR</text>
        <path d="M-10 442 C 200 436, 420 448, 650 438" fill="none" stroke="var(--color-tahini)" strokeWidth="4" />
        <text x="36" y="430" fill="var(--color-charcoal-60)" fontSize="11" fontWeight="600" letterSpacing="2">42ND AVENUE</text>

        {/* little landscape strokes, logo-style */}
        <g stroke="var(--color-sage)" strokeWidth="1.4" fill="none" opacity="0.7">
          <path d="M120 260 q6 -14 12 0 M126 248 v18" />
          <path d="M480 140 q6 -14 12 0 M486 128 v18" />
          <path d="M520 400 q6 -14 12 0 M526 388 v18" />
          <path d="M92 380 q6 -14 12 0 M98 368 v18" />
        </g>

        {/* the shop — gold marker on Washington, between I-10 and Country Club */}
        <g className="transition-transform duration-300 ease-brand group-hover:-translate-y-1">
          <circle cx="303" cy="224" r="26" fill="var(--color-gold)" opacity="0.14" />
          <path
            d="M303 200 c-11 0 -18 8 -18 17 0 12 18 29 18 29 s18 -17 18 -29 c0 -9 -7 -17 -18 -17 Z"
            fill="var(--color-gold)"
          />
          <circle cx="303" cy="217" r="6" fill="var(--color-cream)" />
        </g>
        <text x="336" y="228" fill="var(--color-charcoal)" fontSize="13" fontWeight="600" letterSpacing="1.5">THE WRAP SHACK</text>
        <text x="336" y="245" fill="var(--color-charcoal-60)" fontSize="11">Suite 109 · Bermuda Dunes</text>

        {/* compass */}
        <g transform="translate(588 428)" stroke="var(--color-olive)" fill="none" strokeWidth="1.4">
          <circle r="16" />
          <path d="M0 -10 L4 4 L0 1 L-4 4 Z" fill="var(--color-olive)" />
        </g>
        <text x="583" y="462" fill="var(--color-charcoal-60)" fontSize="10" fontWeight="600">N</text>
      </svg>
      <span className="block border-t border-tahini px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-60 transition-colors duration-250 group-hover:text-forest">
        Open in Google Maps →
      </span>
    </a>
  );
}
