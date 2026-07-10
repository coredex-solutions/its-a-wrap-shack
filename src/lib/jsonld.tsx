import { getSite, getCategories, getMenuByCategory, getFaq } from "@/lib/content";
import type { Dietary } from "@/lib/content";

/** All JSON-LD is sourced from the content layer — never hand-typed values. */

const DIET_MAP: Partial<Record<Dietary, string>> = {
  vegan: "https://schema.org/VeganDiet",
  vegetarian: "https://schema.org/VegetarianDiet",
  "gluten-free": "https://schema.org/GlutenFreeDiet",
};

export function restaurantJsonLd() {
  const site = getSite();
  const sameAs = [site.socials.instagram, site.socials.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    alternateName: `${site.name} — ${site.descriptor}`,
    url: site.url,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/brand/logo.png`,
    telephone: "+1-760-360-8178",
    email: site.email,
    servesCuisine: site.cuisine,
    acceptsReservations: false,
    priceRange: "$$",
    hasMenu: `${site.url}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function menuJsonLd() {
  const site = getSite();
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu#menu`,
    name: `${site.name} Menu`,
    inLanguage: "en-US",
    hasMenuSection: getCategories().map((cat) => ({
      "@type": "MenuSection",
      name: cat.label,
      hasMenuItem: getMenuByCategory(cat.id).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        ...(item.price !== null
          ? {
              offers: {
                "@type": "Offer",
                price: item.price.toFixed(2),
                priceCurrency: "USD",
              },
            }
          : {}),
        ...(item.dietary.some((d) => DIET_MAP[d])
          ? {
              suitableForDiet: item.dietary
                .map((d) => DIET_MAP[d])
                .filter(Boolean),
            }
          : {}),
      })),
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getFaq().map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbsJsonLd(
  crumbs: { name: string; path: string }[],
) {
  const site = getSite();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${site.url}${c.path}`,
      })),
    ],
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((d, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
    />
  ));
}
