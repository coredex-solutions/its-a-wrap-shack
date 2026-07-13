"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { getMenu, formatPrice, type Dietary, type MenuItem } from "@/lib/content";
import { initGsap, prefersReducedMotion, EASE } from "@/lib/gsap";
import DietaryBadge from "@/components/ui/DietaryBadge";
import Button from "@/components/ui/Button";

const PREVIEW_IDS = [
  "chicken-shawarma-wrap",
  "falafel-wrap",
  "gyro-wrap",
  "chicken-shawarma-bowl",
  "hummus",
  "fattoush",
  "tabouleh",
  "baklava",
] as const;

const FILTERS: { key: Dietary; label: string }[] = [
  { key: "vegan", label: "Vegan" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "gluten-free", label: "Gluten-Free" },
];

/** Shared pill + Flip filtering — the same behavior the menu page uses. */
export function useDietaryFilter(listRef: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<ReadonlySet<Dietary>>(new Set());
  const flipState = useRef<ReturnType<
    ReturnType<typeof initGsap>["Flip"]["getState"]
  > | null>(null);

  const toggle = (k: Dietary) => {
    if (listRef.current && !prefersReducedMotion()) {
      const { Flip } = initGsap();
      flipState.current = Flip.getState(
        listRef.current.querySelectorAll("[data-item]"),
      );
    }
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    const { gsap, Flip } = initGsap();
    const state = flipState.current;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.55,
      ease: EASE,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.45, ease: EASE },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.98, duration: 0.3, ease: EASE }),
    });
  });

  const matches = (item: MenuItem) =>
    [...active].every((k) => item.dietary.includes(k));

  return { active, toggle, matches };
}

export function FilterPills({
  active,
  onToggle,
}: {
  active: ReadonlySet<Dietary>;
  onToggle: (k: Dietary) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Dietary filters">
      {FILTERS.map((f) => {
        const on = active.has(f.key);
        return (
          <button
            key={f.key}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(f.key)}
            className={[
              "rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-[background-color,color,box-shadow] duration-250 ease-brand",
              on
                ? "bg-forest text-cream"
                : "bg-transparent text-charcoal-60 shadow-[inset_0_0_0_1px_var(--color-tahini)] hover:text-forest hover:shadow-[inset_0_0_0_1px_var(--color-olive)]",
            ].join(" ")}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

export default function MenuPreview() {
  const menu = getMenu();
  const items = PREVIEW_IDS.map((id) => menu.find((m) => m.id === id)!).filter(
    Boolean,
  );
  const listRef = useRef<HTMLUListElement>(null);
  const { active, toggle, matches } = useDietaryFilter(listRef);
  const visibleCount = items.filter(matches).length;

  return (
    <section aria-labelledby="preview-heading" className="grain bg-cream">
      <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-16 md:px-10 md:pb-36 md:pt-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-gold-ink" data-reveal>
              From the menu
            </p>
            <h2
              id="preview-heading"
              className="display-section mt-4 text-charcoal"
              data-reveal
            >
              A first taste
            </h2>
          </div>
          <div data-reveal>
            <FilterPills active={active} onToggle={toggle} />
          </div>
        </div>

        <ul ref={listRef} className="mt-8 md:mt-12" aria-live="polite">
          {items.map((item) => {
            const show = matches(item);
            return (
              <li
                key={item.id}
                data-item
                data-reveal
                className={`border-b border-tahini/60 py-4 first:border-t md:py-6 ${show ? "" : "hidden"}`}
                aria-hidden={!show}
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-[1.6rem] font-medium leading-snug text-charcoal">
                    {item.name}
                  </h3>
                  <span className="flex translate-y-[-1px] items-center gap-2">
                    {item.dietary.map((k) => (
                      <DietaryBadge key={k} kind={k} />
                    ))}
                  </span>
                  <span
                    aria-hidden
                    className="mx-1 flex-1 border-b border-dotted border-tahini"
                  />
                  <span className="shrink-0 font-medium text-charcoal">
                    {formatPrice(item)}
                  </span>
                </div>
                <p className="body-copy mt-1.5 line-clamp-2 max-w-[58ch] text-[14.5px] leading-relaxed text-charcoal-60 md:line-clamp-none">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
        {visibleCount === 0 && (
          <p className="mt-8 font-display text-xl italic text-charcoal-60">
            Nothing in this small preview matches — the full menu has plenty.
          </p>
        )}

        <div className="mt-8 md:mt-12" data-reveal>
          <Button href="/menu">See the full menu</Button>
        </div>
      </div>
    </section>
  );
}
