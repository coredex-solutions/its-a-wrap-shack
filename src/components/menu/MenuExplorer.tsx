"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  getCategories,
  getMenuByCategory,
  formatPrice,
  getCloverUrl,
  type MenuItem,
} from "@/lib/content";
import { FilterPills, useDietaryFilter } from "@/components/home/MenuPreview";
import DietaryBadge from "@/components/ui/DietaryBadge";
import Divider from "@/components/ui/Divider";

/**
 * The full menu: sticky category rail + dietary filter pills, with GSAP
 * Flip layout transitions on filter changes (no jarring pops).
 */
export default function MenuExplorer() {
  const categories = getCategories();
  const clover = getCloverUrl();
  const listRef = useRef<HTMLDivElement>(null);
  const { active, toggle, matches } = useDietaryFilter(listRef);
  const [current, setCurrent] = useState(categories[0].id);

  // track which category heading is in view for the rail's active state
  useEffect(() => {
    const sections = document.querySelectorAll("[data-menu-category]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setCurrent(
              (e.target as HTMLElement).dataset.menuCategory as typeof current,
            );
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => {
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      {/* filter pills — sticky below the header on all viewports */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-tahini bg-cream/95 px-5 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Menu categories" className="-mx-1 overflow-x-auto md:hidden">
            <ul className="flex gap-1 whitespace-nowrap px-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jump(c.id)}
                    aria-current={current === c.id}
                    className={[
                      "rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-250",
                      current === c.id
                        ? "bg-forest text-cream"
                        : "text-charcoal-60 hover:text-forest",
                    ].join(" ")}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <FilterPills active={active} onToggle={toggle} />
          <p className="hidden text-[13px] text-charcoal-60 lg:block">
            Everything on this menu is 100% halal.
          </p>
        </div>
      </div>

      <div className="grid gap-12 pb-28 pt-12 md:grid-cols-[220px_1fr] md:gap-16">
        {/* desktop rail */}
        <nav aria-label="Menu categories" className="hidden md:block">
          <ul className="sticky top-[160px] space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => jump(c.id)}
                  aria-current={current === c.id}
                  className={[
                    "group flex w-full items-center gap-3 py-2 text-left text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors duration-250",
                    current === c.id
                      ? "text-forest"
                      : "text-charcoal-60 hover:text-forest",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "h-px bg-gold transition-[width] duration-300 ease-brand",
                      current === c.id ? "w-6" : "w-0 group-hover:w-3",
                    ].join(" ")}
                  />
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* item sections */}
        <div ref={listRef}>
          {categories.map((cat, ci) => {
            const items = getMenuByCategory(cat.id);
            const visible = items.filter(matches);
            return (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                data-menu-category={cat.id}
                aria-labelledby={`cat-${cat.id}-h`}
                className={`scroll-mt-[150px] ${visible.length === 0 ? "hidden" : ""} ${ci > 0 ? "mt-20" : ""}`}
              >
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <h2
                    id={`cat-${cat.id}-h`}
                    className="font-display text-[clamp(2rem,3.2vw,2.8rem)] font-medium text-charcoal"
                  >
                    {cat.label}
                  </h2>
                  {cat.note && (
                    <p className="text-[13px] text-charcoal-60">{cat.note}</p>
                  )}
                </div>
                <Divider tone="olive" className="mt-4 max-w-[120px]" />

                <ul className="mt-8 grid gap-5 lg:grid-cols-2">
                  {items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      clover={clover}
                      hidden={!matches(item)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  item,
  clover,
  hidden,
}: {
  item: MenuItem;
  clover: string;
  hidden: boolean;
}) {
  return (
    <li
      data-item
      aria-hidden={hidden}
      className={[
        "group relative flex flex-col bg-garlic transition-colors duration-300 ease-brand hover:bg-tahini/40",
        item.featured ? "lg:col-span-2" : "",
        hidden ? "hidden" : "",
      ].join(" ")}
    >
      <div className={item.featured ? "grid md:grid-cols-[1fr_auto]" : ""}>
        {item.image && item.featured && (
          <div className="relative order-2 hidden min-h-[220px] md:block md:w-[300px]">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col px-7 py-7 md:px-9 md:py-8">
          {item.featured && (
            <p className="eyebrow mb-3 text-gold">House favorite</p>
          )}
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-[1.55rem] font-medium leading-snug text-charcoal">
              {item.name}
            </h3>
            <span
              aria-hidden
              className="mx-1 hidden flex-1 border-b border-dotted border-tahini sm:block"
            />
            <span className="shrink-0 font-medium text-charcoal">
              {formatPrice(item)}
            </span>
          </div>
          <p className="body-copy mt-2 text-[14.5px] leading-relaxed text-charcoal-60">
            {item.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="flex items-center gap-3">
              {item.dietary.map((k) => (
                <DietaryBadge key={k} kind={k} withLabel />
              ))}
            </span>
            <a
              href={clover}
              target="_blank"
              rel="noopener"
              className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold"
            >
              Order on Clover ↗
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
