# The Wrap Shack — itsawrapshack.com

Marketing site for **The Wrap Shack — Mediterranean Eats** (Lebanese/Mediterranean, 100% Halal, fast-casual). Premium editorial build; nothing may read as templated or AI-generated. Ordering is 100% delegated to Clover via external links.

## Brand facts (authoritative)

- Brand name in all UI/copy/metadata/schema: **"The Wrap Shack"**, descriptor "Mediterranean Eats". **Never** write "It's A Wrap Shack".
- Domain: `itsawrapshack.com` (intentionally differs from brand name — do not "fix").
- Marketing location: Palm Desert, Southern California. Real address (contact page + JSON-LD only): 40100 Washington St Suite 109, Bermuda Dunes, CA 92203.
- Phone (760) 360-8178 · itsawrapshack@outlook.com · Mon–Sun 11:00am–8:00pm · online ordering 11:30am–7:30pm.
- Clover: `https://www.clover.com/online-ordering/wrap-shack-bermuda-dunes` — single constant `CLOVER_ORDER_URL` in `content/site.ts`; every Order button consumes it (`target="_blank" rel="noopener"`).
- Never redesign the logo. `public/brand/logo.png` (transparent, original colors) and `logo-cream.png` (cream monochrome, for forest/dark surfaces) are the only logo assets.

## Design tokens (exact — CSS variables, mirrored in Tailwind theme)

```
--forest:      #1F3B2C   primary — deep Mediterranean forest green
--olive:       #75815B   sage-olive of the logo illustration
--sage:        #A8B396   soft supporting green
--cream:       #FAF6EE   page background — warm off-white
--garlic:      #F2EAD9   raised surfaces / cards
--tahini:      #D9C7A7   borders, subtle fills
--sand:        #C4A16B   kraft-paper warm sand
--gold:        #C9962E   accent — toasted gold, SPARINGLY (decorative/large/dark-surface only)
--gold-ink:    #8C6414   WCAG-passing gold for SMALL text + focus ring on cream/garlic
--charcoal:    #26241F   text — logo ink
--charcoal-60: rgba(38,36,31,0.68) secondary text (spec said 0.62; 0.68 passes AA on cream)
```

Contrast law: bright `--gold` is 2.5:1 on cream — never use it for text under 24px
or focus indicators on light surfaces; use `--gold-ink` there. Gold text on forest
(#1F3B2C) passes at any size.

Rules:
- Cream is the dominant field. Forest is for full-bleed "moment" chapters (story, final CTA) — the page alternates light/dark chapters.
- Gold ONLY on: primary CTA hover, small eyebrow labels, one hairline detail per section. Max ~3 gold instances per viewport.
- No pure `#FFF`, no pure `#000`, anywhere.
- Gradients: ≤3% luminance shifts or a warm hero vignette only. No gradient blobs, no glassmorphism, no neon.

## Typography

- Display/headings: **Cormorant Garamond** 500/600 + italic 500 (`next/font`, `display: swap`). Never positive letter-spacing on Cormorant; never weight ≥700.
- Body: **Montserrat** 400/500 — 17px/1.7, max-width 65ch. Nav/buttons/labels: Montserrat 600 uppercase, tracking 0.08em–0.12em.
- Hero display: `clamp(3.5rem, 8vw, 7.5rem)`, line-height 0.95, tracking -0.02em. Section headings: `clamp(2.25rem, 4vw, 3.75rem)`.
- Editorial device: large Cormorant italic pull-lines (story section) with GSAP SplitText line reveals.

## Motion language (site-wide law)

- Libraries: **GSAP (ScrollTrigger, SplitText) + Lenis only.** No Framer Motion, no AOS, no Three.js.
- Animate **only `transform` and `opacity`**.
- One easing family: `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP custom ease). Reveals 0.7–0.9s; micro-interactions 200–300ms.
- Reveal pattern: rise 24–32px + fade, stagger 60–90ms, trigger ~75% viewport, **once only**.
- Card images: 1.04→1.0 scale-settle on reveal; 1.0→1.03 on hover.
- Exactly ONE parallax outside the hero: story imagery at 0.9× scroll speed.
- Every animated element respects `prefers-reduced-motion: reduce` — no exceptions.
- `will-change` applied narrowly, removed after animation. No scroll listeners outside ScrollTrigger/Lenis.

## Hero (signature)

- Pinned scroll-scrubbed **canvas frame sequence** (never scrub `video.currentTime`, never plain `<video>`).
- Frames: `public/hero-frames/lg/f_001..150.webp` (1280w) & `sm/f_001..080.webp` (768w). `sm` when `(max-width: 767px)` or `saveData`.
- Poster `public/hero-frames/hero-poster.webp` = frame 1, rendered via `next/image` `priority` → it is the LCP. Canvas fades in over it.
- Progressive preload: every 5th frame first, then backfill; `createImageBitmap` where supported. No loader UI.
- Pin ~300vh (200vh touch), `scrub: 0.5`, Lenis raf drives `ScrollTrigger.update`.
- The video's baked-in logo ending is a garbled AI rendition — never show it. Scrub range stops before it; final hold crossfades to a cream DOM overlay with the REAL `logo.png` (see `HeroSequence`).
- Reduced motion: static hero (wrap still, not smoke frame 1), same overlay content, no pin.

## Signature details

- Faint paper-grain texture (~2–3% opacity, tiny repeating tile) on cream sections.
- Section dividers: thin hand-drawn irregular SVG line (1px, olive) — not `border-top`.
- Twine-knot SVG motif as story-section list bullet — used ONCE site-wide.
- Buttons: pill, forest fill, cream text, min 32px horizontal padding, Montserrat 600 13–14px uppercase. Hover: deeper green, gold 1px inner keyline fades in, arrow translates 4px. 250ms, brand ease.
- Focus states: gold 2px offset ring. Skip link present.

## Banned patterns

Shopping cart/checkout/reservations/accounts/DB · tilt-on-hover cards · magnetic buttons · custom cursors · preloaders/percentage counters · gradient blobs · glassmorphism · Google Maps JS SDK (static map image only) · raster stock dietary badges (use our line-icon SVG set) · copy clichés ("culinary journey", "explosion of flavors", "hidden gem") · keyword stuffing · re-animating reveals on scroll-up.

## Architecture

- Next.js (App Router, latest) · React 19 · TS strict · Tailwind v4 · GSAP + Lenis · RHF + Zod (contact form only).
- Routes: `/`, `/menu`, `/about`, `/contact`. Contact form posts to a route handler that is a clearly-marked TODO stub.
- All content in typed files under `content/` (site.ts, menu.ts, testimonials.ts, faq.ts). Components consume ONLY via `lib/content.ts` accessors — never import content files directly (future CMS seam).
- Menu data is the REAL menu transcribed from `public/brand/Wrap shack menu.pdf`.
- SEO: per-route Metadata API, JSON-LD (Restaurant, Menu/MenuItem, FAQPage, BreadcrumbList) sourced from `content/site.ts`, sitemap.ts, robots.ts, canonical `https://itsawrapshack.com`.
- Analytics: env-gated GA4 via `next/script` (`NEXT_PUBLIC_GA_ID`, renders nothing unset). Deploy-agnostic — no Vercel-only APIs.
- Performance: Lighthouse ≥95 ×4, mobile+desktop. LCP = hero poster. GSAP/Lenis loaded only where used.

## Asset pipeline notes

- Frame extraction used portable ffmpeg with `delogo=x=1124:y=568:w=72:h=64` (removes a baked-in watermark sparkle, bottom-right) — re-run on any new video export with `-f image2` forced (ffmpeg 8 otherwise writes a single animated webp).
- Logo knockout script: scratchpad `pdfwork/logo-knockout.js` (distance-from-white matte + unpremultiply).
- Gallery stills live in scratchpad `stills/` — video-derived placeholders until real photography arrives.
