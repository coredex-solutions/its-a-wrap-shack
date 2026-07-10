import HeroSequence from "@/components/hero/HeroSequence";
import TrustStrip from "@/components/home/TrustStrip";
import StorySection from "@/components/home/StorySection";
import SignatureDishes from "@/components/home/SignatureDishes";
import MenuPreview from "@/components/home/MenuPreview";
import GallerySection from "@/components/home/GallerySection";
import Testimonials from "@/components/home/Testimonials";
import VisitSection from "@/components/home/VisitSection";
import FinalCta from "@/components/home/FinalCta";
import Divider from "@/components/ui/Divider";
import { JsonLd, restaurantJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />
      <HeroSequence />
      <TrustStrip />
      <StorySection />
      <SignatureDishes />
      <div className="grain bg-cream">
        <Divider className="mx-auto max-w-[1100px] px-5" />
      </div>
      <MenuPreview />
      <GallerySection />
      <Testimonials />
      <div className="grain bg-cream">
        <Divider className="mx-auto max-w-[1100px] px-5" />
      </div>
      <VisitSection />
      <FinalCta />
    </>
  );
}
