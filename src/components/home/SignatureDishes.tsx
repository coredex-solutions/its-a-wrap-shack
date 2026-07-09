import Image from "next/image";
import Link from "next/link";
import { getMenu, formatPrice } from "@/lib/content";
import DietaryBadge from "@/components/ui/DietaryBadge";
import Divider from "@/components/ui/Divider";

/**
 * Four editorial cards in an asymmetric layout. Two carry imagery; Falafel
 * and Salads are typographic cards (no accurate photo exists yet — never a
 * gray placeholder box).
 */

const DISHES = [
  {
    itemId: "chicken-shawarma-wrap",
    title: "Chicken Shawarma",
    blurb: "Off the spit, double-grilled, finished with the garlic sauce people drive across the valley for.",
    image: "/images/dishes/chicken-shawarma.webp",
    imageAlt: "Chicken shawarma wrap tied with twine, parsley scattered around it",
  },
  {
    itemId: "gyro-wrap",
    title: "Beef Shawarma & Gyros",
    blurb: "Beef and lamb roasted vertical and shaved thin — tzatziki on the gyro, tahini on the beef.",
    image: "/brand/shawarma-hero.png",
    imageAlt: "Wrapped shawarma cone in kraft paper tied with twine",
  },
  {
    itemId: "falafel-wrap",
    title: "Falafel",
    blurb: "Chickpeas and fava ground with herbs and sesame, fried to order. Crisp shell, green heart.",
    image: null,
    imageAlt: "",
  },
  {
    itemId: "fattoush",
    title: "Fresh Salads",
    blurb: "Tabouleh heavy on the parsley, fattoush under crispy pita, pomegranate dressing made here.",
    image: null,
    imageAlt: "",
  },
] as const;

export default function SignatureDishes() {
  const menu = getMenu();
  const items = DISHES.map((d) => ({
    ...d,
    item: menu.find((m) => m.id === d.itemId)!,
  }));
  const [a, b, c, d] = items;

  return (
    <section aria-labelledby="dishes-heading" className="grain bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[52ch]">
          <p className="eyebrow text-gold" data-reveal>
            Signature dishes
          </p>
          <h2 id="dishes-heading" className="display-section mt-4 text-charcoal" data-reveal>
            What we&rsquo;re known for
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-12">
          {/* large image card */}
          <DishImageCard dish={a} className="md:col-span-7" ratio="aspect-[5/4]" />
          {/* offset image card */}
          <DishImageCard dish={b} className="md:col-span-5 md:mt-20" ratio="aspect-[4/5]" />
          {/* typographic pair, counter-offset */}
          <DishTypeCard dish={c} className="md:col-span-5 md:-mt-14" />
          <DishTypeCard dish={d} className="md:col-span-7" />
        </div>
      </div>
    </section>
  );
}

type Dish = {
  title: string;
  blurb: string;
  image: string | null;
  imageAlt: string;
  item: ReturnType<typeof getMenu>[number];
};

function Meta({ dish }: { dish: Dish }) {
  return (
    <div className="flex items-center gap-4">
      <span className="eyebrow text-charcoal-60">
        from {formatPrice(dish.item)}
      </span>
      <span className="flex items-center gap-2">
        {dish.item.dietary.map((k) => (
          <DietaryBadge key={k} kind={k} />
        ))}
      </span>
    </div>
  );
}

function DishImageCard({
  dish,
  className = "",
  ratio,
}: {
  dish: Dish;
  className?: string;
  ratio: string;
}) {
  return (
    <Link
      href="/menu"
      className={`group block ${className}`}
      data-reveal
      aria-label={`${dish.title} — see the menu`}
    >
      <div className={`relative overflow-hidden bg-garlic ${ratio}`}>
        <Image
          src={dish.image!}
          alt={dish.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
          data-reveal-img
        />
      </div>
      <div className="flex items-baseline justify-between gap-6 pt-5">
        <h3 className="font-display text-[2rem] font-medium leading-tight text-charcoal">
          {dish.title}
        </h3>
        <Meta dish={dish} />
      </div>
      <p className="body-copy mt-2 text-[15.5px] text-charcoal-60">{dish.blurb}</p>
    </Link>
  );
}

function DishTypeCard({ dish, className = "" }: { dish: Dish; className?: string }) {
  return (
    <Link
      href="/menu"
      className={`group flex flex-col justify-between bg-garlic px-8 py-10 transition-colors duration-300 ease-brand hover:bg-tahini/40 md:px-12 md:py-14 ${className}`}
      data-reveal
      aria-label={`${dish.title} — see the menu`}
    >
      <div>
        <Divider tone="olive" className="max-w-[72px]" />
        <h3 className="mt-6 font-display text-[clamp(2.2rem,3.4vw,3rem)] font-medium leading-[1.05] text-charcoal">
          {dish.title}
        </h3>
        <p className="body-copy mt-4 text-[15.5px] text-charcoal-60">{dish.blurb}</p>
      </div>
      <div className="mt-10">
        <Meta dish={dish} />
      </div>
    </Link>
  );
}
