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
      <svg viewBox="0 0 640 480" className="h-full w-full" role="img" aria-hidden>
        {/* field */}
        <rect width="640" height="480" fill="var(--color-garlic)" />

        {/* I-10 — double band, upper left corner */}
        <path d="M-10 96 C 140 64, 320 56, 650 30" fill="none" stroke="var(--color-tahini)" strokeWidth="14" />
        <path d="M-10 96 C 140 64, 320 56, 650 30" fill="none" stroke="var(--color-garlic)" strokeWidth="2" strokeDasharray="10 12" />
        <text x="52" y="66" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(-6 52 66)">INTERSTATE 10</text>

        {/* Washington St — the spine */}
        <path d="M300 -10 C 306 140, 302 330, 310 490" fill="none" stroke="var(--color-olive)" strokeWidth="6" opacity="0.85" />
        <text x="322" y="392" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(87 322 372)">WASHINGTON ST</text>

        {/* cross streets */}
        <path d="M-10 208 C 180 200, 460 212, 650 204" fill="none" stroke="var(--color-tahini)" strokeWidth="4" />
        <text x="36" y="196" fill="var(--color-charcoal-60)" fontSize="11" fontWeight="600" letterSpacing="2">AVENUE 42</text>
        <path d="M-10 356 C 200 350, 420 362, 650 352" fill="none" stroke="var(--color-tahini)" strokeWidth="4" />
        <text x="36" y="344" fill="var(--color-charcoal-60)" fontSize="11" fontWeight="600" letterSpacing="2">COUNTRY CLUB DR</text>

        {/* little landscape strokes, logo-style */}
        <g stroke="var(--color-sage)" strokeWidth="1.4" fill="none" opacity="0.7">
          <path d="M120 280 q6 -14 12 0 M126 268 v18" />
          <path d="M480 140 q6 -14 12 0 M486 128 v18" />
          <path d="M520 420 q6 -14 12 0 M526 408 v18" />
          <path d="M92 430 q6 -14 12 0 M98 418 v18" />
        </g>

        {/* the shop — gold marker between Ave 42 and Country Club */}
        <g className="transition-transform duration-300 ease-brand group-hover:-translate-y-1">
          <circle cx="303" cy="282" r="26" fill="var(--color-gold)" opacity="0.14" />
          <path
            d="M303 258 c-11 0 -18 8 -18 17 0 12 18 29 18 29 s18 -17 18 -29 c0 -9 -7 -17 -18 -17 Z"
            fill="var(--color-gold)"
          />
          <circle cx="303" cy="275" r="6" fill="var(--color-cream)" />
        </g>
        <text x="336" y="286" fill="var(--color-charcoal)" fontSize="13" fontWeight="600" letterSpacing="1.5">THE WRAP SHACK</text>
        <text x="336" y="303" fill="var(--color-charcoal-60)" fontSize="11">Suite 109 · Bermuda Dunes</text>

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
