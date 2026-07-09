"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCloverUrl } from "@/lib/content";
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
 */
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [overHero, setOverHero] = useState(isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cloverUrl = getCloverUrl();

  useEffect(() => {
    setMenuOpen(false);
    const sentinel = document.querySelector("[data-hero-sentinel]");
    if (!sentinel) {
      setOverHero(false);
      return;
    }
    setOverHero(true);
    // Flip to the solid bar when the hero's release point passes the header's
    // lower edge. An IntersectionObserver reads live geometry, so the hero's
    // pin spacer can never leave it with a stale position.
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.boundingClientRect.top > 72),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    // ...and go solid as soon as the hero's cream end-field fades in, where
    // transparent cream ink would disappear (dispatched by the scrub).
    const onCream = (e: Event) =>
      setOverHero(!(e as CustomEvent<{ solid: boolean }>).detail.solid);
    window.addEventListener("hero:creamphase", onCream);
    return () => {
      io.disconnect();
      window.removeEventListener("hero:creamphase", onCream);
    };
  }, [pathname]);

  // Mobile overlay: staggered link reveal, scroll lock.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen && overlayRef.current && !prefersReducedMotion()) {
      const { gsap } = initGsap();
      gsap.fromTo(
        overlayRef.current.querySelectorAll("[data-menu-item]"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.07, delay: 0.15 },
      );
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMenuOpen(false);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, onKeyDown]);

  const transparent = overHero && !menuOpen;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-brand",
          transparent
            ? "bg-transparent"
            : "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-tahini)]",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Link href="/" aria-label="The Wrap Shack — home" className="shrink-0">
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
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "eyebrow relative py-2 transition-colors duration-250",
                      transparent
                        ? "text-cream hover:text-tahini"
                        : "text-charcoal hover:text-forest",
                      pathname === item.href
                        ? "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-gold"
                        : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={cloverUrl}
              target="_blank"
              rel="noopener"
              className={[
                "group hidden items-center gap-2.5 rounded-full px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] transition-[background-color,box-shadow,color] duration-250 ease-brand sm:inline-flex",
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
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={[
                "flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden",
                menuOpen || !transparent ? "text-charcoal" : "text-cream",
              ].join(" ")}
            >
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-250 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-250 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay — forest chapter, Cormorant links */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        className={[
          "fixed inset-0 z-40 flex flex-col justify-center bg-forest px-8 pt-[72px] transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-2">
            {NAV.map((item) => (
              <li key={item.href} data-menu-item>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-[2.75rem] font-medium leading-[1.2] text-cream hover:text-tahini"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li data-menu-item className="pt-8">
              <a
                href={cloverUrl}
                target="_blank"
                rel="noopener"
                tabIndex={menuOpen ? 0 : -1}
                className="inline-flex items-center gap-3 rounded-full bg-cream px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-forest"
              >
                Order Now <span aria-hidden>→</span>
              </a>
            </li>
          </ul>
        </nav>
        <p data-menu-item className="eyebrow absolute bottom-10 left-8 text-sage">
          Palm Desert · 100% Halal
        </p>
      </div>
    </>
  );
}
