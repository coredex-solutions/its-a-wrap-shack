import type { Metadata } from "next";
import { cormorant, montserrat } from "@/lib/fonts";
import { getSite } from "@/lib/content";
import { loadContent } from "@/lib/cms/store";
import SmoothScroll from "@/components/motion/SmoothScroll";
import RevealManager from "@/components/motion/RevealManager";
import ContentHydrator from "@/components/ContentHydrator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import "./globals.css";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.titleDefault,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${site.name} · ${site.descriptor}`,
    url: site.url,
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.descriptor}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: ["/og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // CMS-merged content: primes the server snapshot and hydrates the client one
  const content = await loadContent();
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* progressive-enhancement guard: [data-reveal] only hides when JS runs */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ContentHydrator data={content}>
          <SmoothScroll />
          <RevealManager />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Analytics />
        </ContentHydrator>
      </body>
    </html>
  );
}
