import { loadContent } from "@/lib/cms/store";
import SmoothScroll from "@/components/motion/SmoothScroll";
import RevealManager from "@/components/motion/RevealManager";
import ContentHydrator from "@/components/ContentHydrator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Marketing-site chrome: smooth scrolling, reveals, header/footer — kept out
 * of the root layout so /admin renders without any of it.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // CMS-merged content: primes the server snapshot and hydrates the client one
  const content = await loadContent();
  return (
    <ContentHydrator data={content}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <RevealManager />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </ContentHydrator>
  );
}
