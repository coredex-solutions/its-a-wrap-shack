import HeroSequence from "@/components/hero/HeroSequence";
import TrustStrip from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <HeroSequence />
      <TrustStrip />
      {/* Phase 2: story · signature dishes · menu preview · gallery ·
          testimonials · visit us · final CTA */}
      <section className="grain bg-cream py-40 text-center">
        <p className="eyebrow text-olive">More coming in Phase 2</p>
      </section>
    </>
  );
}
