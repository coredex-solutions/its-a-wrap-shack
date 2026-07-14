import type { Metadata } from "next";
import MenuExplorer from "@/components/menu/MenuExplorer";
import MenuOrderBar from "@/components/menu/MenuOrderBar";
import Button from "@/components/ui/Button";
import HalalBadge from "@/components/ui/HalalBadge";
import { getSite, getCloverUrl } from "@/lib/content";
import { loadContent } from "@/lib/cms/store";
import { JsonLd, pageGraph } from "@/lib/jsonld";

const TITLE = "Halal Menu · Shawarma, Wraps & Mezza";
const DESCRIPTION =
  "The full Wrap Shack menu with prices — chicken and beef shawarma, gyros, falafel, bowls, mezza, and baklava. 100% halal, with vegan and gluten-free options. Palm Desert area.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  await loadContent(); // prime the content snapshot before anything renders
  const site = getSite();
  const clover = getCloverUrl();
  return (
    <div className="grain bg-cream">
      <JsonLd
        data={pageGraph({
          path: "/menu",
          title: TITLE,
          description: DESCRIPTION,
          breadcrumbs: [{ name: "Menu", path: "/menu" }],
          withMenu: true,
        })}
      />
      <header className="mx-auto max-w-[1400px] px-5 pb-8 pt-28 md:px-10 md:pb-10 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-gold-ink">The menu</p>
            <h1 className="display-section mt-4 max-w-[16ch] text-charcoal">
              Everything halal.
              <br />
              Everything fresh.
            </h1>
            <p className="body-copy mt-5 max-w-[52ch] text-[15.5px] text-charcoal-60">
              Stacked, rolled, and fried to order all day. {site.hours.orderingWindow}.
            </p>
          </div>
          <div className="flex items-center gap-6 pb-2">
            <HalalBadge className="h-14 w-14" />
            <Button href={clover} external>
              Order on Clover
            </Button>
          </div>
        </div>
        {/* once this leaves the viewport, the mobile order bar slides in */}
        <span data-orderbar-sentinel aria-hidden />
      </header>
      <MenuExplorer />

      {/* catering pointer — group orders live on their own page (phone, 48h) */}
      <section
        aria-labelledby="catering-pointer"
        className="border-t border-tahini bg-garlic"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10 md:py-16">
          <div>
            <p className="eyebrow text-gold-ink">Feeding a crowd?</p>
            <h2
              id="catering-pointer"
              className="mt-3 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight text-charcoal"
            >
              Trays and platters built for ten.
            </h2>
            <p className="body-copy mt-2 text-[15px] text-charcoal-60">
              Shawarma platters, mezza trays, salads, and baklava — ordered by
              phone, 48 hours ahead.
            </p>
          </div>
          <Button href="/catering" variant="outline">
            See the catering menu
          </Button>
        </div>
      </section>

      <MenuOrderBar />
    </div>
  );
}
