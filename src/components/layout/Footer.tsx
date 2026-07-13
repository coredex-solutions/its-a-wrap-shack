import Link from "next/link";
import Image from "next/image";
import { getSite, getCloverUrl } from "@/lib/content";
import HalalBadge from "@/components/ui/HalalBadge";

export default function Footer() {
  const site = getSite();
  const clover = getCloverUrl();

  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-12">
          <div>
            <Image
              src="/brand/logo-cream.png"
              alt="The Wrap Shack — Mediterranean Eats"
              width={140}
              height={112}
              className="h-auto w-[128px]"
            />
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-sage">
              Lebanese wraps, shawarma, and mezza — made fresh every day on
              Washington Street.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-tahini">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link href="/menu" className="hover:text-tahini">Menu</Link></li>
              <li><Link href="/about" className="hover:text-tahini">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-tahini">Visit Us</Link></li>
              <li>
                <a href={clover} target="_blank" rel="noopener" className="hover:text-tahini">
                  Order Online
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-tahini">Visit</h2>
            <address className="mt-4 space-y-2.5 text-[15px] not-italic">
              <p>
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </p>
              <p>
                <a href={site.phoneHref} className="hover:text-tahini">
                  {site.phone}
                </a>
              </p>
              <p>{site.hours.display}</p>
              <p className="text-[13px] text-sage">{site.hours.orderingWindow}</p>
            </address>
          </div>

          <div className="flex flex-col items-start gap-5">
            <HalalBadge tone="cream" className="h-16 w-16" />
            {(site.socials.instagram || site.socials.facebook) && (
              <div>
                <h2 className="eyebrow text-tahini">Follow</h2>
                <ul className="mt-3 flex items-center gap-3">
                  {site.socials.instagram && (
                    <li>
                      <a
                        href={site.socials.instagram}
                        target="_blank"
                        rel="noopener"
                        aria-label="The Wrap Shack on Instagram"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream shadow-[inset_0_0_0_1px_rgba(250,246,238,0.25)] transition-[background-color,color] duration-250 ease-brand hover:bg-cream hover:text-forest"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                        </svg>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col md:mt-14 gap-2 border-t border-cream/15 pt-6 text-[13px] text-sage md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.descriptor}
          </p>
          <p>
            {site.address.locality}, California · 100% Halal
          </p>
        </div>
      </div>
    </footer>
  );
}
