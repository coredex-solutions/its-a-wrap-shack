---
name: ""
overview: ""
todos: []
isProject: false
---

# Reusable SEO, Performance & AI SEO Improvement Plan

Use this plan as a prompt for an AI agent to improve any website's **performance**, **SEO**, and **AI/LLM visibility**. Replace placeholders like `[SITE_NAME]`, `[PRIMARY_KEYWORD]`, `[DOMAIN]` with the actual site's values.

---

## Performance (Core Web Vitals & Lighthouse 100)

### Targets (must pass ALL)

- **LCP (Largest Contentful Paint):** under 1.2s (desktop), under 2.0s (mobile)
- **TBT (Total Blocking Time):** 0ms
- **INP (Interaction to Next Paint):** under 200ms — minimize JavaScript, use server components
- **CLS (Cumulative Layout Shift):** 0.000
- **FCP (First Contentful Paint):** under 0.8s (desktop), under 1.5s (mobile)
- **Speed Index:** under 1.0s (desktop), under 2.0s (mobile)

### LCP

- LCP element must render in the first server response; zero JavaScript required for initial paint.
- If hero text is LCP: render H1 with SSG; never hide LCP with `opacity: 0` or `transform` before paint.
- If hero image is LCP: use `<img>` with `fetchpriority="high"`, `loading="eager"`, explicit dimensions, and `<link rel="preload" as="image" fetchpriority="high">`.
- If hero video: use a static poster image as LCP (optimized WebP), preload it; load video after page is interactive.
- No client-side data fetching for above-the-fold content; use SSG/SSR.
- **Fonts:** Use local font files (not CDN). `display: 'swap'`. Preload primary font. Subset to used characters. Max ~2 font families, 3–4 weights.

### TBT (Total Blocking Time = 0ms)

- Prefer React Server Components; ship zero unnecessary JS. Use `'use client'` only on interactive leaf components; push it as deep as possible.
- Prefer CSS-only animations; avoid animation libraries on public pages. Dynamic-import heavy JS only when needed (e.g. when component mounts).
- No third-party scripts in critical path; load analytics/chat after consent.
- **JS budget:** First-load JS under ~80KB compressed; monitor with build output and bundle analyzer. **Performance budget:** fail the build if First Load JS exceeds e.g. 100KB.

### CLS

- Explicit `width` and `height` on every `<img>` and `<video>`; use `aspect-ratio` on containers.
- Font `display: swap` with `font-size-adjust` or `size-adjust` to match fallback metrics.
- No dynamically injected content above the fold that resizes layout (e.g., cookie banner at bottom).
- No ads/embeds that resize after load. Skeleton loaders must match final dimensions.
- Reserve space for lazy images with `min-height` / aspect-ratio. Fixed nav height.

### FCP

- Inline critical CSS for above-the-fold; keep critical path CSS under ~14KB compressed.
- No render-blocking external stylesheets or script.
- TTFB under 200ms for SSG/cached pages.
- HTML document under ~50KB for initial response. Use streaming SSR + Suspense where needed.

### Server & Caching

- HTTP/2. Brotli (primary) + Gzip fallback; Brotli for text/html, text/css, application/javascript, application/json, image/svg+xml.
- HSTS (Strict-Transport-Security). Cache-Control, ETag, Last-Modified. Static hashed assets: long-term cache, immutable. HTML (ISR): e.g. Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800.
- No redirect chains (max one hop). TTFB under 200ms.

**Resource loading priority (order):** (1) Critical CSS (inlined or preloaded), (2) Primary font (preloaded WOFF2), (3) LCP image (preload fetchpriority=high), (4) HTML document (streamed with Suspense if needed), (5) Non-critical CSS, (6) JavaScript (deferred, after paint), (7) Below-fold images (lazy), (8) Hero video / heavy media (after interaction), (9) Third-party scripts (after consent), (10) Analytics last.

### Validation

- Run PageSpeed Insights on key pages (mobile + desktop). Target 100/100 where feasible.
- Lighthouse in CI/CD to prevent regressions. Monitor Core Web Vitals in Search Console and in production (e.g. `next/web-vitals`).

---

## SEO Implementation Checklist

### 1. HTML Head Meta Tags (every page)

**Core:**

- `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">`.
- Unique `<title>` per page: keyword-rich, primary keyword front-loaded, under 60 chars, pipe + brand.
- Unique `<meta name="description">` per page, under 155 chars, CTA + primary/secondary keywords.
- `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">` (and same for `googlebot`, `bingbot`).
- `author`, `publisher`, `copyright`, `application-name`.
- `theme-color` (both light and dark `media`), `color-scheme: light dark`.
- `<meta name="format-detection" content="telephone=no">` (prevent unwanted auto-linking).
- `<meta name="mobile-web-app-capable" content="yes">`, `<meta name="apple-mobile-web-app-capable" content="yes">`, `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`, `<meta name="apple-mobile-web-app-title" content="[SITE_NAME]">`.
- **Geo (local SEO):** `geo.region`, `geo.placename`, `geo.position`, `ICBM`, `language`, `content-language` (e.g. `en-LB`, `ar-LB`).
- **Verification:** `google-site-verification`, `msvalidate.01` (Bing), `yandex-verification`; `p:domain_verify` (Pinterest) if needed.
- **AI/GEO:** `<meta name="ai-content-declaration" content="human-created">`; structured speakable sections in JSON-LD for voice search.

### 2. Open Graph (all pages)

- `og:title` (matches or slightly varies from title tag), `og:description` (slightly different angle from meta description), `og:image` (1200×630 PNG), `og:image:width`, `og:image:height`, `og:image:alt`, `og:image:type`.
- `og:url` (canonical), `og:type` (website / article / product), `og:site_name`, `og:locale`, `og:locale:alternate` (other locale), `og:determiner` (e.g. "the"), `og:see_also` (URLs to related pages).
- For articles: `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag` (multiple).
- For products/places: `product:price:amount`, `product:price:currency`, `place:location:latitude`, `place:location:longitude` if relevant.

### 3. Twitter Card (all pages)

- `twitter:card` (e.g. `summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`, `twitter:site`, `twitter:creator` for articles.

### 4. Link Tags

- **Canonical:** self-referencing `<link rel="canonical" href="...">` on every page.
- **Hreflang:** `<link rel="alternate" hreflang="en" href="...">`, same for each locale, plus `<link rel="alternate" hreflang="x-default" href="...">`.
- **Feeds:** `<link rel="alternate" type="application/rss+xml" title="[Site] Blog" href="/feed.xml">`, `<link rel="alternate" type="application/atom+xml" href="/atom.xml">`.
- **Sitemap:** `<link rel="sitemap" type="application/xml" href="/sitemap.xml">`.
- **OpenSearch:** `<link rel="search" type="application/opensearchdescription+xml" title="[Site]" href="/opensearch.xml">` if site search exists.
- **Favicon / app icon set (complete):** `<link rel="icon" href="/favicon.ico" sizes="48x48">`, `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, PNG sizes 16, 32, 96, 192, 512, `<link rel="apple-touch-icon" sizes="180x180">` (and 152, 167), `<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="[theme]">`, `<link rel="manifest" href="/site.webmanifest">`.
- **Performance hints:** `preconnect` for critical origins (e.g. fonts, analytics), `dns-prefetch` for third parties, `preload` as="image" for LCP image (fetchpriority="high"), `preload` as="font" type="font/woff2" crossorigin for primary font, `prefetch` for likely next navigation, `modulepreload` for critical JS modules.

### 5. Dynamic OG/Twitter Images

- Every route gets auto-generated social cards (e.g. `opengraph-image.tsx`): 1200×630px PNG, brand logo watermark, brand fonts and colors.
- Per-route content: homepage (brand + tagline), listing pages (title + preview of items), entity detail (hero image + name + location + brand), blog post (title + author + date + category), contact (title + phone + email + location), legal (page title on branded template).
- Generate at build time for static pages, on-demand for dynamic pages.
- Optional `twitter-image.tsx` where a different crop/size is beneficial.

### 6. JSON-LD Structured Data (20+ types)

Validate every schema via Google Rich Results Test and Schema Markup Validator before deployment.

**Global (injected on every page):**

- **Organization:** name, legalName, url, logo (ImageObject with url + width + height), image, description, foundingDate, founder, numberOfEmployees, address (PostalAddress: streetAddress, addressLocality, addressRegion, addressCountry, postalCode), contactPoint (ContactPoint: telephone, email, contactType "customer service", areaServed, availableLanguage), sameAs (all social URLs), areaServed (GeoCircle with geoMidpoint + geoRadius where applicable), slogan, knowsAbout, hasOfferCatalog.
- **LocalBusiness** (subtype e.g. GeneralContractor): all Organization props + openingHoursSpecification (DayOfWeek + opens/closes), geo (GeoCoordinates), priceRange, paymentAccepted, currenciesAccepted, hasMap (Google Maps URL), isAccessibleForFree, aggregateRating (from testimonials).
- **WebSite:** url, name, description, publisher (Organization ref), potentialAction (SearchAction with query-input), inLanguage, copyrightYear, copyrightHolder.
- **SiteNavigationElement:** array of main nav links (name + url).

**Per-page:**

- **WebPage:** @type varies (WebPage, CollectionPage, ContactPage, AboutPage, ItemPage, FAQPage). Properties: name, description, url, inLanguage, isPartOf (WebSite ref), breadcrumb (BreadcrumbList ref), primaryImageOfPage, datePublished, dateModified, speakable (SpeakableSpecification with cssSelector targeting key content).
- **BreadcrumbList:** on every page; full path with position + name + item URL.
- **CollectionPage + ItemList:** on listing pages; itemListElement as ListItem (position, name, url, image).
- **Product:** name, description, image (array), url, brand (Organization ref), category, offers (Offer: priceCurrency, availability, areaServed), additionalProperty (PropertyValue array e.g. bedrooms, area, floors).
- **Place + GeoCoordinates:** address (PostalAddress), geo, hasMap, name (for entity/contact locations).
- **RealEstateListing** (if applicable): datePosted, name, description, url (future-proofing).
- **Accommodation** (for property types): numberOfRooms, floorSize (QuantitativeValue), amenityFeature, occupancy.
- **ImageGallery:** associatedMedia array of ImageObject (contentUrl, thumbnail, caption, width, height, encodingFormat).
- **ImageObject:** for significant images — contentUrl, width, height, caption, representativeOfPage, creditText, copyrightHolder, license.
- **VideoObject:** name, description, thumbnailUrl, uploadDate, duration (ISO 8601), contentUrl, embedUrl, publisher, potentialAction (WatchAction).
- **Article / BlogPosting:** headline, alternativeHeadline, description, image, datePublished, dateModified, author (Person with name + url), publisher (Organization with name + logo), mainEntityOfPage, wordCount, articleBody (first 200 chars), articleSection, keywords (array), inLanguage, speakable (SpeakableSpecification).
- **FAQPage:** mainEntity array of Question + acceptedAnswer (Answer with text).
- **HowTo:** name, description, step (HowToStep: name, text, image, url), totalTime, estimatedCost.
- **Review:** author (Person), reviewBody, reviewRating (Rating: ratingValue, bestRating), datePublished, itemReviewed (LocalBusiness ref).
- **AggregateRating:** ratingValue, reviewCount, bestRating, worstRating, itemReviewed.
- **ContactPage / AboutPage:** name, description, url, mainEntity.
- **Person:** for team/author — name, jobTitle, worksFor, image, sameAs.
- **Service:** name, description, provider, areaServed, serviceType, offers.
- **OfferCatalog:** linked from Organization; itemListElement array of Offer or Service.
- **Event** (if applicable): name, startDate, endDate, location (Place), organizer, eventStatus, eventAttendanceMode.
- **SpeakableSpecification:** cssSelector array targeting headline, first paragraph, key blocks (voice/AI).

### 7. XML Sitemaps

- Dynamic sitemap index at `/sitemap.xml` with sub-sitemaps: e.g. sitemap-pages.xml (static: home, contact, legal, about), sitemap-projects.xml, sitemap-blog.xml, sitemap-categories.xml, sitemap-tags.xml — each in all locales.
- Each entry: `<loc>` (full canonical URL), `<lastmod>` in ISO 8601 datetime form `YYYY-MM-DDTHH:MM:SS+00:00` (actual content modification time), `<xhtml:link rel="alternate" hreflang="en" href="..."/>` (and for every other locale).
- **Image extension:** `<image:image>` with image:loc, image:title, image:caption, image:geo_location, image:license where relevant.
- **Video extension:** `<video:video>` with video:thumbnail_loc, video:title, video:description, video:content_loc, video:duration for pages with video.
- Regenerate on content publish (ISR revalidation or on-demand). Do NOT use changefreq or priority (Bing ignores them).

### 8. robots.txt

- **Default:** `User-agent:` * — Allow: / ; Disallow: /admin/, /api/, /_next/, /404, /500 (adjust paths to project). Repeat explicit Allow/Disallow for Googlebot and Bingbot if needed.
- **AI crawlers (critical for AI visibility):** Explicitly allow ALL of the following. If crawlers cannot access the site, AI assistants will not cite it. OAI-SearchBot is required for ChatGPT Search citations.
- **Sitemap and Host:** `Sitemap: https://[DOMAIN]/sitemap.xml` and `Host: https://[DOMAIN]`.

**Complete AI crawler allow-list (allow all):**


| Crawler           | Owner        | Purpose                              |
| ----------------- | ------------ | ------------------------------------ |
| OAI-SearchBot     | OpenAI       | ChatGPT Search / SearchGPT citations |
| ChatGPT-User      | OpenAI       | ChatGPT browsing mode                |
| GPTBot            | OpenAI       | Training + retrieval                 |
| Google-Extended   | Google       | Gemini training + AI Overviews       |
| Googlebot         | Google       | Google Search + AI Overviews         |
| Bingbot           | Microsoft    | Bing Search + Copilot                |
| PerplexityBot     | Perplexity   | Perplexity AI search                 |
| ClaudeBot         | Anthropic    | Claude retrieval                     |
| anthropic-ai      | Anthropic    | Claude training                      |
| Applebot          | Apple        | Siri + Apple Intelligence            |
| Applebot-Extended | Apple        | Apple Intelligence features          |
| Bytespider        | ByteDance    | TikTok search                        |
| CCBot             | Common Crawl | Open training data                   |
| YouBot            | You.com      | You.com AI search                    |
| PhindBot          | Phind        | Phind developer search               |
| DuckDuckBot       | DuckDuckGo   | DuckDuck AI answers                  |
| cohere-ai         | Cohere       | Cohere models                        |
| AI2Bot            | AI2          | Allen AI research                    |


Add new crawlers as they emerge.

### 9. Bing

- `<meta name="msvalidate.01" content="...">` and `BingSiteAuth.xml` in public root.
- **IndexNow:** Generate API key and host key file at `/indexnow-key.txt`. API route (e.g. `/api/indexnow`) that pings Bing when content is published/updated. Auto-trigger on: new/updated blog post, new/updated project or entity, any page content change. Batch URL submission support (up to 10,000 URLs per call).
- Submit sitemap via Bing Webmaster Tools. Ensure all sitemap `<lastmod>` are precise ISO 8601 (Bing relies on these). Do NOT use changefreq or priority in sitemaps (Bing ignores them).
- **browserconfig.xml:** msapplication-TileColor, msapplication-TileImage, msapplication-square70x70logo, square150x150logo, wide310x150logo, square310x310logo.
- Bing Places listing aligned with NAP.

### 10. Google

- `google-site-verification`; Google Search Console: submit all sitemaps, request indexing for key pages.
- NAP consistent with Google Business Profile. `<meta name="google" content="notranslate">` on pages that should not be auto-translated.
- Google Merchant Center: use Product schema for listings where applicable.
- **Google Discover:** high-quality images (1200px+ wide), engaging titles, E-E-A-T signals.
- Core Web Vitals monitoring via Search Console; page experience: HTTPS, mobile-friendly, no intrusive interstitials.
- Rich Results: FAQ, HowTo, Article, Review, Video, Breadcrumb, LocalBusiness, Product.

### 11. AI/LLM Visibility (GEO / AEO)

**Goal:** Get cited by ChatGPT, Copilot, Gemini, Perplexity, Claude, Siri for relevant queries.

#### 11A. llms.txt and llms-full.txt (LLM-native content files)

These are the most important files for AI visibility — they tell LLMs who the site is and what it does in a format LLMs consume without parsing HTML.

**llms.txt** (summary file, under 50KB, served as text/markdown). Structure (adapt to site):

- **Title:** `# [SITE_NAME]`
- **Opening blockquote:** One paragraph (2–4 sentences) that is a citable summary: who, what, where, key differentiator.
- **About:** Links to about page and key “why us” content.
- **Services / Products:** List of main offerings with links (e.g. by category or type).
- **Key [entities/projects/products]:** Named items with short description and URL.
- **Contact:** Phone, email, address, WhatsApp/social, website URL.
- **What we do NOT do:** Clear boundaries (reduces wrong citations).
- **Social:** All social profile URLs.

**llms-full.txt** (comprehensive):

- Full text of every important page: homepage, about, all entity/project/product descriptions, all blog posts, contact, services, FAQ, testimonials.
- Organized with clear H2 section headers.
- Updated automatically when content changes (build-time script or on-demand). Gives LLMs the full knowledge base in one request.

#### 11B. robots.txt

- Allow all AI search/retrieval crawlers (see §8). Blocking them prevents AI citations.

#### 11C. Content structure for AI citation (“citation lock-in”)

Content that arrives first with quality signals gets “locked in” as a preferred source. Strategy:

- **TL;DR in first 60 words (+35% citation rate):** Every page begins with a concise, self-contained summary paragraph. The first paragraph must be citable standalone (who, what, where, key fact). Same pattern on every page type.
- **Answer-first architecture:** Every page answers a specific question an AI might be asked. Examples: homepage → “What is the best [category] in [location]?”; listing → “What are the best [entities] in [location]?”; entity page → “Where can I [get/find/buy] [thing] in [location]?”; blog → long-tail informational queries.
- **Atomic answer units:** Break content into self-contained paragraphs (40–60 words optimal for extraction). Include specific data: numbers, years, locations, names. Example pattern: “[Site] has [metric] since [year] across [locations]. Our [portfolio/catalog] includes [counts and types], all featuring [differentiator].”
- **Question-format headers:** Use actual questions as H2/H3 that match what people ask assistants (e.g. “What is the best [X] in [Y]?”, “Where can I [Z]?”, “How much does [X] cost?”, “What makes [Site] different?”).

#### 11D. Structured data as AI signal

- JSON-LD (especially Organization with sameAs) helps AI treat the site as a verified entity. Keep schemas complete and valid.

#### 11E. Topical authority cluster (blog/content)

- **Pillar pages** (high-level, link to all cluster posts): e.g. “Complete Guide to [Topic] [Year]”, “[Topic] in [Location]: Everything You Need to Know”, “[Niche] [Topic]”.
- **Cluster posts** (each targets a specific query): e.g. “Best [X] in [Location]”, “How to Choose [Y]: N Factors”, “Cost of [Z] [Year] Guide”, “Why [Location/Feature] is Best for [Topic]”, “[Category] Standards: What to Look For”, “Trends in [Industry] [Year]”. Each post: 1500–2500 words, FAQ at bottom, internal links to entities/related posts, datePublished + dateModified visible, author with credentials.

#### 11F. GEO (Generative Engine Optimization) technical

- Server-side rendering (SSG/ISR) for ALL content — AI crawlers do not execute JavaScript reliably.
- Clean semantic HTML that AI can parse without JS.
- datePublished and dateModified on all content (visible + in schema); recency is a top AI citation signal.
- Author bylines with E-E-A-T credentials on blog posts.
- Statistics and specific numbers embedded in text (AI cites specific data).
- Internal citation: reference your own sources (e.g. “According to our [year] data…”).
- External citation where relevant: link to authoritative sources (government, industry standards).
- Avoid walls of text — use structured formats (lists, tables, headings, short paragraphs).

#### 11G. AEO (Answer Engine Optimization) for voice + featured snippets

- SpeakableSpecification schema on homepage, about, and all blog posts.
- FAQ schema (FAQPage) on homepage, key listing pages, and relevant blog posts. Each FAQ answer: 2–3 sentences, under 30 seconds reading time, conversational tone.
- Write in natural language that sounds good when read aloud by a voice assistant.
- Target “near me” queries: ensure Google Business Profile and local schema are complete.
- **Definition-style** content for “what is” queries: “What is [X]? [X] is…”
- **Process-style** content for “how to” queries: numbered steps with HowTo schema.

#### 11H. Platform-specific AI optimization

- **Microsoft Copilot (Bing):** Bing indexing is the foundation; IndexNow for fastest discovery; Bing Places for entity data. Ranking high on Bing = cited by Copilot.
- **ChatGPT / SearchGPT (OpenAI):** OAI-SearchBot must be allowed; llms.txt gives structured context; content must be server-rendered (ChatGPT-User browses like a basic browser). **Fast page load is critical — ChatGPT-User has timeout limits.**
- **Google Gemini:** Allow Google-Extended; strong Google Search ranking = strong Gemini citation (shared index). AI Overviews pull from top-ranking content. Product/LocalBusiness schema helps entity understanding.
- **Perplexity:** PerplexityBot uses real-time web search — freshest content wins; clear, citable paragraphs get cited most; FAQ format is preferred. **Fast crawl response (under 1s) — Perplexity times out on slow sites.**
- **Apple Siri / Apple Intelligence:** Allow Applebot and Applebot-Extended; schema is Siri’s primary data source; local business info feeds Apple Maps; Speakable schema targets voice responses.
- **Claude:** Allow ClaudeBot and anthropic-ai; clean, well-structured content preferred; llms.txt and llms-full.txt are directly consumable.

#### 11I. AI citation monitoring

- Regularly test: ask ChatGPT, Copilot, Gemini, Perplexity, Claude the target queries and variants.
- Track which platforms cite the site and which do not; update content to fill gaps.
- Monitor competitor citations and counter with stronger, more citable content.
- Use tools like Qwairy, Cited.so, or manual testing to track AI visibility.

### 12. Local SEO

- **NAP consistency:** Business name, full address, phone — identical on every page and in all external directories (Google Business Profile, Bing Places, Apple Maps, Yellow Pages / industry directories).
- **Google Business Profile:** Primary and secondary categories, photos, posts, Q&A, reviews. Bing Places and Apple Maps with matching NAP.
- **Local schema:** LocalBusiness with GeoCoordinates on every page; embedded Google Maps on contact page with correct pin.
- **Location-specific content:** Dedicated content mentioning key cities/regions naturally; local keyword optimization per page.
- **Service area pages:** Consider dedicated landing pages or blog posts for “[service] in [city]”, “[service] near [city]” etc.
- **Local citations:** Consistent NAP on relevant directories and industry listings.
- **Reviews/testimonials:** Structured Review and AggregateRating schema.
- **Multilingual local:** If the site is multilingual, provide local SEO (location names, NAP) in each language (e.g. Arabic location names for Arabic-speaking searchers).

### 13. Semantic HTML (accessibility + SEO)

- **Landmarks:** `<header>` (role="banner"), `<nav>` with aria-label="Main Navigation" (and "Mobile Navigation" for mobile nav), `<main>` role="main" id="main-content", `<article>` for blog/entity content, `<section>` with aria-labelledby to section heading, `<aside>` for sidebar (TOC, related), `<footer>` role="contentinfo".
- **Content:** `<address>` for contact info; `<time datetime="ISO-8601">` for all dates; `<figure>` + `<figcaption>` for captioned images; `<picture>` + `<source>` for responsive WebP/AVIF and fallback.
- **FAQ / specs:** `<details>` + `<summary>` for expandable FAQ; `<dl>` + `<dt>` + `<dd>` for specs/definitions.
- **Text:** `<mark>` for highlighted terms; `<abbr title="...">` for abbreviations; `<blockquote cite="...">` and `<cite>` for testimonials/attribution; `<hgroup>` for title + subtitle.
- **Headings:** Single `<h1>` per page; strictly sequential h2 → h3 → h4 (no skipping).
- **Images:** Every `<img>` has descriptive alt; decorative images use `alt=""`. Responsive images with explicit dimensions.
- **Accessibility:** Skip link (e.g. `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`); keyboard-accessible interactives with visible focus; minimum 4.5:1 contrast (WCAG 2.2 AA); touch targets minimum 44×44px; ARIA live regions for dynamic updates (forms, loading); `lang` and `dir` on mixed-language content; respect `prefers-reduced-motion` for animations.

### 14. Image SEO

**Alt text (under 125 characters, keyword-rich; never start with “Image of” or “Photo of”):**

- Entity/project images: “[Entity Name] - [specific description] - [Brand], [Location]”.
- Team: “[Name], [Role] at [Brand] [Location]”.
- Office/location: “[Brand] [type] in [Location] - [description]”.
- Decorative/background: `alt=""` and `role="presentation"`.

**Technical:**

- WebP with JPEG/PNG fallback via `<picture>`; AVIF where supported. Responsive `srcset` with sizes e.g. 640w, 750w, 828w, 1080w, 1200w, 1920w, 2048w; `sizes` attribute appropriate to layout.
- Explicit `width` and `height` on every `<img>` (prevent CLS). `loading="lazy"` below the fold; `loading="eager"` + `fetchpriority="high"` on hero/LCP only. `decoding="async"` on all images.
- Compression: ~80% quality for JPEG/WebP; lossless for PNG icons. Max dimensions: e.g. hero 1920px wide, thumbnails 640px. Strip EXIF on upload. SEO-friendly filenames (kebab-case, descriptive).
- `<figure>` + `<figcaption>` for captioned images (captions are indexed).
- **Image sitemap:** image:loc, image:title, image:caption, image:geo_location, image:license where relevant.

### 15. URL structure & internal linking

**URLs:** Lowercase, hyphen-separated, no trailing slash; short, descriptive, keyword-rich slugs; no URL parameters for content pages; 301 redirects for changed URLs; custom 404 with helpful navigation/search; no orphan pages (every page linked from at least one other).

**Internal linking:** Contextual links within blog/content to related entities and posts; “Related [entities]” / “Related posts” on detail pages; breadcrumb on every page (visual + schema); footer links to all major sections; anchor text with descriptive keywords (not “click here”). Hub pages: e.g. category/type pages that link to all items of that type; blog category and tag pages linking to all posts. Cross-link language versions via hreflang and visible language switcher.

### 16. Content SEO

**On-page (per page):** Primary keyword in: title tag, meta description, H1, first 100 words, URL slug, at least one H2, image alt, OG title. Secondary and LSI keywords distributed naturally. Keyword density: ~1–2% primary, ~0.5–1% secondary (natural, not stuffed). Unique title and description for every page (no duplicates).

**Intent:** Homepage = broad; listing = consideration; entity pages = long-tail; blog = informational; contact = action.

**E-E-A-T:** About page (history, credentials, team bios); author pages and bylines; client testimonials with real names; portfolio/case studies; certifications/partnerships; contact visible; privacy, terms, legal pages; HTTPS; links to Google Business Profile and social profiles.

### 17. Technical SEO & performance signals

**Core Web Vitals:** LCP under 2.5s, INP (Interaction to Next Paint) under 200ms, CLS under 0.1. SSG/ISR for all public pages; HTTP/2; Brotli (primary) + Gzip; HSTS; Cache-Control, ETag, Last-Modified. Canonical on every page; no redirect chains (max 1 hop); TTFB under 200ms; inline critical CSS; defer non-critical JavaScript; no render-blocking resources. Service worker for offline/caching (optional PWA).

**HTTP security headers (SEO trust + security):** Content-Security-Policy (restrict origins), X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (e.g. camera=(), microphone=(), geolocation=()), Strict-Transport-Security: max-age=31536000; includeSubDomains; preload. X-XSS-Protection: 0 (deprecated but some scanners expect it).

### 18. SEO auxiliary files

- **robots.txt** (see §8), **sitemap.xml** + sub-sitemaps (pages, projects/posts, categories, tags).
- **llms.txt**, **llms-full.txt** (see §11A). Served as text/markdown; llms.txt under 50KB.
- **site.webmanifest:** name, short_name, description, start_url, display, background_color, theme_color, icons (all sizes), categories, lang, dir, screenshots if applicable.
- **browserconfig.xml:** Microsoft tile config (TileColor, TileImage, square70x70, square150x150, wide310x150, square310x310).
- **favicon.ico** (multi-size 16/32/48), **favicon.svg**, full PNG set (16, 32, 96, 192, 512), apple-touch-icon (180, 152, 167), mask-icon (Safari pinned tab).
- **feed.xml** (RSS 2.0): title, link, description, language, lastBuildDate; items with title, link, description, pubDate, guid, category, enclosure for images. **atom.xml** as alternative syndication.
- **opensearch.xml:** shortName, description, inputEncoding, url template (so browsers can add site search to address bar).
- **security.txt** at `/.well-known/security.txt`: contact, expires, preferred-languages, canonical, policy.
- **humans.txt** (optional): /* TEAM */ /* THANKS */ /* SITE */ sections.
- **indexnow-key.txt**, **BingSiteAuth.xml** for IndexNow/Bing.
- **ads.txt**, **app-ads.txt** (even if minimal) to prevent unauthorized ad claims.
- **.well-known/assetlinks.json**, **.well-known/apple-app-site-association** (for app linking; future-proofing).

### 19. Blog/article SEO

- **Markup:** `<article>` with itemscope itemtype="Article"; visible author (link to author page), publication and last modified dates (`<time datetime="...">`), reading time, word count; category and tags (visible + in schema).
- **Navigation:** Table of contents from H2/H3 with anchor links; share buttons; prev/next post (`<link rel="prev">`, `<link rel="next">`); related posts section; author bio (E-E-A-T). Comments section or CTA for engagement.
- **Breadcrumb:** Home > Blog > [Category] > [Post Title] (visual + schema).
- **Schema:** BlogPosting with all properties; SpeakableSpecification (headline, first paragraph); FAQPage/HowTo if post has Q&A or steps. Canonical and hreflang. RSS inclusion (full content or summary).

### 20. Multilingual SEO

- Reciprocal hreflang on every page (all locales + x-default). Correct `lang` and `dir` on `<html>`.
- Locale-specific URLs (e.g. /ar/ for Arabic); separate sitemap entries per language with cross-references.
- Meta titles and descriptions crafted per language (not auto-translate). Content-Language header. Separate OG images per locale if needed. Language switcher on every page; 404 in each language.

### 21. Monitoring & analytics

- **Google Search Console:** Verified; all sitemaps submitted; URL inspection for key pages; performance report; Core Web Vitals; mobile usability; international targeting.
- **Bing Webmaster Tools:** Verified; sitemaps; URL submission; SEO reports.
- **Analytics:** GA4 or privacy-friendly (Plausible, Umami) for organic traffic and conversions; Google Tag Manager (or equivalent) loaded conditionally after cookie consent.
- **Structured data:** Regular validation via Rich Results Test and Schema Markup Validator.
- **Lighthouse CI:** Automated performance and SEO audits in CI/CD pipeline to prevent regressions.
- **Uptime monitoring** (e.g. UptimeRobot). **Broken link checker:** automated periodic scan (e.g. monthly).
- **Search ranking tracking** for target keywords (manual or via tool).

---

## 22. Additional SEO: tags, code & tactics

### Indexing control (when to use)

- **noindex:** Use on thank-you pages, internal search result pages, duplicate sort/filter URLs, staging/preview, low-value utility pages. `<meta name="robots" content="noindex">` or X-Robots-Tag header.
- **nofollow:** Use on untrusted user-generated links, paid/affiliate links, login/registration links when you don’t want to pass equity. `<meta name="robots" content="nofollow">` or `rel="nofollow"` on links. Prefer `rel="sponsored"` for ads and `rel="ugc"` for UGC where appropriate.
- **nosnippet:** Prevents snippet in SERP (rare). `<meta name="robots" content="nosnippet">`.
- **noarchive:** Prevents “Cached” link. `<meta name="robots" content="noarchive">`.
- **noimageindex:** Don’t show images from this page in image search. `<meta name="robots" content="noimageindex">` when needed.
- **Combined:** e.g. `content="noindex, nofollow"` for fully private pages.

### Meta tags to avoid

- **Do not use** `<meta name="keywords" content="...">` — ignored by major engines and can look like spam.
- **Do not use** `<meta name="googlebot" content="noindex">` unless you intend to block Google specifically; use generic `robots` or X-Robots-Tag.

### Additional Open Graph & social

- **Rich media:** `og:video`, `og:video:url`, `og:video:type`, `og:video:width`, `og:video:height`, `og:audio` for video/audio embeds (Facebook, LinkedIn, etc.).
- **Contact on OG:** `og:email`, `og:phone_number` (non-standard but used by some platforms).
- **Twitter:** For video, use `twitter:card="player"` with `twitter:player`, `twitter:player:width`, `twitter:player:height`, `twitter:player:stream` (or `twitter:player:stream:content_type`).
- **LinkedIn:** Uses OG; ensure `og:title`, `og:description`, `og:image` are set; article pages benefit from `article:published_time` and `article:author`.
- **Pinterest:** `og:image` (minimum 600px wide); consider `article:author`. Rich Pins use schema (Product, Article, Recipe).
- **Telegram / Discord:** Rely on OG; same meta as above is usually enough.
- **Disable sitelinks search box (optional):** `<meta name="google" content="nositelinkssearchbox">` if you don’t want the search box in sitelinks.

### More structured data (schema)

- **VideoObject:** Add `transcript` (full text of dialogue/captions) for accessibility and richer indexing.
- **SpecialAnnouncement:** For critical notices (e.g. closures, safety). `datePosted`, `expires` (optional), `text` or `url`.
- **QAPage:** For Q&A content (multiple answers per question). `mainEntity` array of Question with `acceptedAnswer` (one or more Answer). Use in addition to or instead of FAQPage when format fits.
- **ClaimReview / FactCheck:** For fact-check articles. Links to `ClaimReview` with `claimReviewed`, `reviewRating` (e.g. Rating with `author` and `reviewBody`).
- **TechArticle / ScholarlyArticle:** Subtype of Article for technical or academic content; add `proficiencyLevel`, `dependencies`, etc. where relevant.
- **SoftwareApplication / MobileApplication:** If the site promotes an app; include `applicationCategory`, `operatingSystem`, `offers` (price).
- **ContactPoint:** Add `contactOption` (e.g. "TollFree", "HearingImpairedSupported"), `hoursAvailable` (OpeningHoursSpecification), `areaServed` (country or region).
- **Offer:** Add `priceValidUntil` for time-limited prices.
- **ItemList:** Add `numberOfItems` (integer) for list length.
- **Event:** Add `eventAttendanceMode` (e.g. "[https://schema.org/OnlineEventAttendanceMode](https://schema.org/OnlineEventAttendanceMode)"), `virtualLocation` (VirtualLocation with `url`) for online events.
- **Accessibility (CreativeWork / WebPage):** `accessibilityFeature` (e.g. "screenReader", "captions"), `accessibilityHazard` ("noFlashing", "noSound"), `accessMode` ("text", "visual", "auditory") to describe accessibility of the page.

### URL & canonical details

- **WWW vs non-WWW:** Choose one (e.g. non-WWW as canonical); redirect the other with 301; set canonical and all internal links to the chosen version.
- **Trailing slash:** Be consistent site-wide (e.g. no trailing slash); redirect the other variant.
- **URL length:** Prefer under ~60 characters for the path (long URLs get truncated in some UIs); avoid unnecessary parameters in canonical URLs.
- **Pagination:** Use a single canonical (e.g. to “view all” or page 1) or self-referencing canonical per page; avoid duplicate content. For infinite scroll, provide a crawlable list (e.g. “Load more” that appends or a traditional paginated view).
- **Parameter handling:** In GSC, use URL Parameters to mark parameters that don’t change content (e.g. tracking) so they don’t create duplicate URLs in the index.

### Crawl & index hygiene (larger sites)

- **Crawl budget:** Prioritize important URLs in internal linking; fix orphan pages; consider noindex for low-value filters/sorts; keep sitemaps focused on indexable URLs.
- **Mixed content:** Ensure all assets (images, scripts, styles, iframes) load over HTTPS; fix mixed-content warnings.
- **Iframes:** Use `loading="lazy"` on iframes for below-fold embeds; ensure iframe content is not the only place with critical content (engines may not weight it the same as main page content).

### SERP & snippet optimization

- **Featured snippets:** Structure content so the direct answer is in the first paragraph or in a clear list/table; use one question per H2/H3 with a concise answer (40–60 words) below.
- **People Also Ask (PAA):** Use question-style H2/H3 that match real queries; keep answers 2–4 sentences; FAQ schema supports this.
- **Entity salience:** One clear primary topic per page (one main entity or theme); reinforce with schema and clear H1/opening.

### Optional / niche

- **Dublin Core (dc.):** For archives or academic sites, optional meta: `dc.title`, `dc.creator`, `dc.description`, `dc.date`, `dc.format`, `dc.language`. Not required for typical business sites.
- **Early Hints (HTTP 103):** Send `Link` headers for critical resources (e.g. preload) before the full response; can improve LCP on supported servers.
- **News sitemap:** If the site is in Google News, use a dedicated news sitemap with `<news:news>` (publication date, title) and submit in Publisher Center.
- **Indexing API:** For time-sensitive content (e.g. job postings, livestreams), consider Google Indexing API or Bing URL Submission API for faster discovery.

---

## How to use this plan

1. Replace all placeholders (`[SITE_NAME]`, `[DOMAIN]`, `[PRIMARY_KEYWORD]`, etc.) with the actual site’s values.
2. Work through sections in order: Performance first (Core Web Vitals), then meta/OG/Twitter/schemas/sitemaps/robots, then AI/LLM (llms.txt, content structure, GEO/AEO), then local, content, and technical SEO, then monitoring.
3. Use as a one-shot prompt: “Apply the SEO, Performance and AI SEO plan from [this file] to this codebase. Focus on [e.g. meta tags + JSON-LD + llms.txt] first.”

This plan is site-agnostic and reusable for any website.