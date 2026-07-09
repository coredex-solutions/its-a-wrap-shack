/**
 * TODO(owner): replace with real customer quotes (Google/Yelp reviews, with
 * permission). These are PLACEHOLDER quotes written to demonstrate layout —
 * they must not ship to production as-is.
 */

export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The garlic sauce alone is worth the drive down Washington Street. The chicken shawarma actually tastes like it came off a spit, because it did.",
    attribution: "Placeholder review — replace with a real customer quote",
  },
  {
    id: "t2",
    quote:
      "Finally, halal Lebanese food in the desert that doesn't cut corners. The bread is warm, the pickles are sharp, the portions are serious.",
    attribution: "Placeholder review — replace with a real customer quote",
  },
  {
    id: "t3",
    quote:
      "We ordered the mezza sampler for the table and ended up fighting over the last kibbeh. Booking the mixed grill platter next time.",
    attribution: "Placeholder review — replace with a real customer quote",
  },
];
