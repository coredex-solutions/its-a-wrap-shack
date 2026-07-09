import Image from "next/image";

/**
 * Quiet masonry. All imagery is currently derived from the brand film —
 * TODO(owner): replace/extend with real photography when available.
 */
const SHOTS = [
  { src: "/images/gallery/wrap-sauce.webp", alt: "Garlic sauce dripping over a chicken shawarma wrap", tall: true },
  { src: "/images/gallery/ingredients-toss.webp", alt: "Grilled chicken, pita, tomatoes, and pickles tossed mid-air", tall: false },
  { src: "/images/gallery/wrap-open.webp", alt: "An open wrap mid-roll with tomatoes and pickles floating around it", tall: false },
  { src: "/images/gallery/wrap-turn.webp", alt: "A wrapped shawarma cone turning through the smoke", tall: true },
  { src: "/images/gallery/wrap-build.webp", alt: "The wrap coming together over the green studio haze", tall: false },
  { src: "/images/hero-static.webp", alt: "The finished wrap in kraft paper tied with twine", tall: false },
] as const;

export default function GallerySection() {
  return (
    <section aria-label="Gallery" className="border-y border-tahini bg-garlic">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="columns-2 gap-4 md:columns-3 md:gap-6 [&>figure]:mb-4 md:[&>figure]:mb-6">
          {SHOTS.map((s) => (
            <figure
              key={s.src}
              data-reveal
              className="group overflow-hidden break-inside-avoid"
            >
              <div className={`relative ${s.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
