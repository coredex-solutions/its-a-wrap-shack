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
      <header className="mx-auto max-w-[1400px] px-5 pb-10 pt-32 md:px-10 md:pt-40">
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
      <MenuOrderBar />
    </div>
  );
}
