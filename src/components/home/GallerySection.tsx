import Image from "next/image";

/**
 * Quiet masonry — the styled brand set (shot to match the real kitchen's
 * food). TODO(owner): extend with real photography as it arrives.
 */
const SHOTS = [
  { src: "/images/gallery/wrap-sauce.webp", alt: "Kraft-wrapped shawarma cone with steam rising against deep green", tall: true },
  { src: "/images/gallery/ingredients-toss.webp", alt: "Mezza spread — hummus, baba ghanoush, tabouleh, falafel, and warm pita", tall: false },
  { src: "/images/gallery/wrap-open.webp", alt: "Garlic sauce pouring over an open pita piled with beef shawarma", tall: false },
  { src: "/images/gallery/falafel-pita.webp", alt: "Falafel pita with pickled turnips, greens, and tahini", tall: true },
  { src: "/images/gallery/wrap-build.webp", alt: "A gyro pita coming together on the prep line", tall: false },
  { src: "/images/hero-static.webp", alt: "The finished wrap in kraft paper tied with twine", tall: false },
] as const;

export default function GallerySection() {
  return (
    <section aria-label="Gallery" className="border-y border-tahini bg-garlic">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-28">
        <div className="columns-2 gap-4 md:columns-3 md:gap-6 [&>figure]:mb-4 md:[&>figure]:mb-6">
          {SHOTS.map((s) => (
            <figure
              key={s.src}
              data-reveal
              className="group overflow-hidden break-inside-avoid rounded-[14px]"
            >
              <div className={`relative ${s.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={60}
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
