import type { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getSite, getFaq } from "@/lib/content";
import { loadContent } from "@/lib/cms/store";
import BrandMap from "@/components/home/BrandMap";

// Code-split: react-hook-form + zod are a heavy client chunk that must not
// sit in the boot-critical preload list — the SSR'd markup paints either way.
const ContactForm = dynamic(() => import("@/components/contact/ContactForm"));
import Divider from "@/components/ui/Divider";
import OpenNow from "@/components/ui/OpenNow";
import { JsonLd, pageGraph } from "@/lib/jsonld";

const TITLE = "Visit Us · Hours, Location & Contact";
const DESCRIPTION =
  "Find The Wrap Shack at 40100 Washington St, Suite 109, Bermuda Dunes — on the Palm Desert border. Open daily 11 am – 8 pm. Call (760) 360-8178 or send a note.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  await loadContent(); // prime the content snapshot before anything renders
  const site = getSite();
  const faq = getFaq();

  return (
    <div className="grain bg-cream">
      <JsonLd
        data={pageGraph({
          path: "/contact",
          title: TITLE,
          description: DESCRIPTION,
          pageType: "ContactPage",
          breadcrumbs: [{ name: "Visit Us", path: "/contact" }],
          withFaq: true,
        })}
      />
      {/* opening chapter: the heading over the brand image as a full-bleed
          background — the wrap sits right of the text on every viewport */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <Image
          src="/images/contact-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center"
        />
        {/* flat mobile-only veil: the display text can reach the wrap on
            narrow crops — solid color, so no gradient/glass in sight */}
        <span aria-hidden className="absolute inset-0 bg-forest/45 md:hidden" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
          <p className="eyebrow text-gold">Visit us</p>
          <h1 className="display-section mt-4 max-w-[18ch]">
            Come hungry. Leave with extra garlic sauce.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 md:px-10 md:pb-28 md:pt-20">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-[1fr_1.1fr]">
          {/* info + map */}
          <div className="space-y-10">
            <dl className="grid gap-8 sm:grid-cols-2">
              <div data-reveal>
                <dt className="eyebrow text-charcoal-60">Address</dt>
                <dd className="mt-1.5">
                  <address className="not-italic leading-relaxed">
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region}{" "}
                    {site.address.postalCode}
                  </address>
                </dd>
              </div>
              <div data-reveal>
                <dt className="eyebrow text-charcoal-60">Hours</dt>
                <dd className="mt-1.5">
                  {site.hours.display}
                  <span className="mt-1 block text-[14px] text-charcoal-60">
                    {site.hours.orderingWindow}
                  </span>
                  <OpenNow className="mt-2 text-gold-ink" />
                </dd>
              </div>
              <div data-reveal>
                <dt className="eyebrow text-charcoal-60">Phone</dt>
                <dd className="mt-1.5">
                  <a
                    href={site.phoneHref}
                    className="underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div data-reveal>
                <dt className="eyebrow text-charcoal-60">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${site.email}`}
                    className="underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
            <div data-reveal>
              <BrandMap className="aspect-[4/3]" />
            </div>
          </div>

          {/* form */}
          <div data-reveal>
            <h2 className="font-display text-[1.9rem] font-medium text-charcoal">
              Send us a note
            </h2>
            <p className="body-copy mt-2 text-[15px] text-charcoal-60">
              Catering questions, feedback, or a craving we should know about.
              For orders, use the Order buttons — they go straight to the
              kitchen.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-16 max-w-[820px] md:mt-28">
          <p className="eyebrow text-gold-ink">Good to know</p>
          <h2 id="faq-heading" className="display-section mt-4 text-charcoal">
            Questions we hear a lot
          </h2>
          <div className="mt-10">
            {faq.map((f) => (
              <details key={f.id} className="group border-b border-tahini/70 py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-[1.35rem] font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span
                    aria-hidden
                    className="text-olive transition-transform duration-250 ease-brand group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="body-copy mt-3 max-w-[62ch] text-[15px] leading-relaxed text-charcoal-60">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
          <Divider tone="olive" className="mt-10 max-w-[120px] md:mt-16" />
        </section>
      </div>
    </div>
  );
}
