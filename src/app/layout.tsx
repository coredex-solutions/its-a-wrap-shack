import type { Metadata } from "next";
import { cormorant, montserrat } from "@/lib/fonts";
import { getSite } from "@/lib/content";
import SmoothScroll from "@/components/motion/SmoothScroll";
import RevealManager from "@/components/motion/RevealManager";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <SmoothScroll />
        <RevealManager />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
