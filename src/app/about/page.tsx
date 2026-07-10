import type { Metadata } from "next";
import Image from "next/image";
import PullLine from "@/components/motion/PullLine";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import { getCloverUrl } from "@/lib/content";
import { JsonLd, breadcrumbsJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Our Story · Lebanese Kitchen in the Desert",
  description:
    "The Wrap Shack is a family-run Lebanese kitchen in the Palm Desert area — shawarma stacked daily, garlic sauce from a family recipe, everything 100% halal.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Stacked every morning",
    body: "The shawarma spit is built by hand daily — marinated overnight, layered at dawn, roasted slow until service.",
  },
  {
    title: "A sauce with a lineage",
    body: "Our garlic sauce follows a family recipe from Beirut. Small batches, real garlic, no shortcuts, no jars.",
  },
  {
    title: "Halal, entirely",
    body: "Not a section of the menu — the whole menu. Every protein, every plate, every day.",
  },
  {
    title: "Fresh over fast",
    body: "Falafel fried when you order it. Bread warmed when you're here. Salads dressed at the last minute.",
  },
] as const;

export default function AboutPage() {
  const clover = getCloverUrl();
  return (
    <>
      <JsonLd data={breadcrumbsJsonLd([{ name: "Our Story", path: "/about" }])} />
      {/* opening chapter */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10 md:pb-32 md:pt-44">
          <p className="eyebrow text-gold" data-reveal>
            Our story
          </p>
          <h1 className="sr-only">Our Story — The Wrap Shack</h1>
          <PullLine className="mt-6 text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.12]">
            A Lebanese kitchen that crossed an ocean and kept its accent.
          </PullLine>
          <div className="body-copy mt-10 space-y-6 text-[16.5px] leading-[1.85] text-sage">
            <p data-reveal>
              The Wrap Shack began the way most Lebanese cooking does — at a
              family table, with recipes nobody ever wrote down properly because
              everybody already knew them. When our family settled in the
              Coachella Valley, the recipes came along: the seven-spice blend,
              the overnight marinades, the garlic sauce whipped patiently until
              it stands on its own.
            </p>
            <p data-reveal>
              We opened on Washington Street to cook that food the way it
              deserves — fast enough for a lunch break, never faster than the
              food allows.
            </p>
          </div>
        </div>
      </section>

      {/* image band */}
      <section aria-hidden className="relative h-[46vh] min-h-[320px] overflow-hidden border-y border-tahini">
        <Image
          src="/images/gallery/ingredients-toss.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* the daily practice */}
      <section aria-labelledby="values-heading" className="grain bg-cream">
        <div className="mx-auto max-w-[1100px] px-5 py-24 md:px-10 md:py-32">
          <p className="eyebrow text-gold-ink" data-reveal>
            The daily practice
          </p>
          <h2 id="values-heading" className="display-section mt-4 text-charcoal" data-reveal>
            What &ldquo;fresh daily&rdquo; actually means here
          </h2>
          <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} data-reveal>
                <Divider tone="olive" className="max-w-[64px]" />
                <h3 className="mt-5 font-display text-[1.7rem] font-medium text-charcoal">
                  {v.title}
                </h3>
                <p className="body-copy mt-3 text-[15.5px] leading-relaxed text-charcoal-60">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-4" data-reveal>
            <Button href="/menu" variant="outline">
              See the menu
            </Button>
            <Button href={clover} external>
              Order on Clover
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
