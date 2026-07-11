"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCloverUrl, getSite } from "@/lib/content";
import { initGsap, prefersReducedMotion, EASE } from "@/lib/gsap";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Visit Us" },
] as const;

/**
 * Fixed header. Transparent (cream ink) while over the home hero, then a
 * cream, blurred, hairline-bordered bar once the hero releases — tracked via
 * an IntersectionObserver on the hero's [data-hero-sentinel].
 *
 * On the solid bar it auto-hides on scroll-down and reveals on scroll-up
 * (driven by ScrollTrigger so it rides the same rAF as the rest of the site;
 * disabled under reduced motion). The mobile menu is a focus-trapped dialog
 * that restores focus to its toggle on close.
 */
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const site = getSite();
  const cloverUrl = getCloverUrl();

  const [overHero, setOverHero] = useState(isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Live mirror so the single ScrollTrigger can read current flags.
  const flags = useRef({ menuOpen, overHero });
  flags.current = { menuOpen, overHero };

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  // Scroll-state: transparent over the hero, solid after it releases.
  useEffect(() => {
    setMenuOpen(false);
    const sentinel = document.querySelector("[data-hero-sentinel]");
    if (!sentinel) {
      setOverHero(false);
      return;
    }
    setOverHero(true);
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.boundingClientRect.top > 72),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    const onCream = (e: Event) =>
      setOverHero(!(e as CustomEvent<{ solid: boolean }>).detail.solid);
    window.addEventListener("hero:creamphase", onCream);
    return () => {
      io.disconnect();
      window.removeEventListener("hero:creamphase", onCream);
    };
  }, [pathname]);

  // Auto-hide on scroll-down / reveal on scroll-up (solid bar only).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { ScrollTrigger } = initGsap();
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const { menuOpen: open, overHero: over } = flags.current;
        if (open || over) {
          setHidden(false);
          return;
        }
        setHidden(self.direction === 1 && self.scroll() > 180);
      },
    });
    return () => st.kill();
  }, []);

  // Mobile overlay: scroll lock + staggered link reveal.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen && overlayRef.current && !prefersReducedMotion()) {
      const { gsap } = initGsap();
      gsap.fromTo(
        overlayRef.current.querySelectorAll("[data-menu-item]"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.07, delay: 0.12 },
      );
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Dialog behavior: focus trap, Escape to close, restore focus on close.
  useEffect(() => {
    if (!menuOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      ).filter((el) => el.tabIndex !== -1);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [menuOpen]);

  const transparent = overHero && !menuOpen;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,transform] duration-500 ease-brand",
          hidden ? "-translate-y-full" : "translate-y-0",
          transparent
            ? "bg-transparent"
            : "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-tahini)]",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Link
            href="/"
            aria-label="The Wrap Shack — home"
            className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            <Image
              src={transparent ? "/brand/logo-cream.png" : "/brand/logo.png"}
              alt="The Wrap Shack — Mediterranean Eats"
              width={92}
              height={74}
              className="h-[52px] w-auto"
              priority
            />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "eyebrow group relative py-2 outline-none transition-colors duration-250",
                        "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                        transparent
                          ? "text-cream hover:text-tahini"
                          : "text-charcoal hover:text-forest",
                      ].join(" ")}
                    >
                      {item.label}
                      {/* underline grows from centre on hover; held for active */}
                      <span
                        aria-hidden
                        className={[
                          "absolute -bottom-0.5 left-0 h-px w-full origin-center transition-transform duration-300 ease-brand",
                          transparent ? "bg-cream" : "bg-gold-ink",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100",
                        ].join(" ")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={cloverUrl}
              target="_blank"
              rel="noopener"
              className={[
                "group hidden items-center gap-2.5 rounded-full px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] outline-none transition-[background-color,box-shadow,color] duration-250 ease-brand sm:inline-flex",
                "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                transparent
                  ? "bg-cream text-forest hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
                  : "bg-forest text-cream hover:bg-forest-deep hover:shadow-[inset_0_0_0_1px_var(--color-gold)]",
              ].join(" ")}
            >
              Order Now
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={[
                "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-sm outline-none md:hidden",
                "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                menuOpen || !transparent ? "text-charcoal" : "text-cream",
              ].join(" ")}
            >
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay — forest chapter, Cormorant links */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={[
          "fixed inset-0 z-40 flex flex-col justify-center bg-forest px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[72px] transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} data-menu-item>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    className="group flex items-baseline gap-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
                  >
                    <span
                      aria-hidden
                      className="w-6 shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage/70"
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={[
                        "relative font-display text-[2.75rem] font-medium leading-[1.15] transition-colors duration-250",
                        active ? "text-gold" : "text-cream group-hover:text-tahini",
                      ].join(" ")}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute -left-4 top-1/2 h-px w-2.5 -translate-y-1/2 bg-gold"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div data-menu-item className="mt-9">
            <a
              href={cloverUrl}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? 0 : -1}
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-forest outline-none transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
            >
              Order Now
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </nav>

        {/* footer rail — call + provenance */}
        <div className="absolute inset-x-8 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col gap-2">
          <a
            data-menu-item
            href={site.phoneHref}
            tabIndex={menuOpen ? 0 : -1}
            className="eyebrow inline-flex w-fit items-center gap-2 text-cream outline-none transition-colors duration-250 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {site.phone}
          </a>
          <p data-menu-item className="eyebrow text-sage">
            Palm Desert · 100% Halal
          </p>
        </div>
      </div>
    </>
  );
}
