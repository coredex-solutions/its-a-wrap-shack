/**
 * Real customer reviews (Google, 2025–2026), provided by the owner.
 * Lightly edited for spelling/length only — meaning and voice preserved.
 * Trims: location/currency fragments specific to another context removed so
 * they don't contradict the site's Palm Desert positioning.
 */

export interface Testimonial {
  id: string;
  quote: string;
  /** Display name as it appears publicly on Google. */
  attribution: string;
  /** Where the review came from (credibility signal + schema source). */
  source?: string;
  /** Star rating, 1–5. Defaults to 5. */
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "johns-garage",
    quote:
      "This shawarma wasn't just food — it was an experience. The meat was tender, juicy, and seasoned to perfection. The garlic sauce was creamy and bold without being overpowering, blending perfectly with the tangy pickles and fresh vegetables. Once you've had this, nothing else compares.",
    attribution: "John's Garage",
    source: "Google review",
    rating: 5,
  },
  {
    id: "mirel-c",
    quote:
      "Everything was freshly made — even the chips were cooked right after I placed my order — and the shawarma was unbelievably fresh and delicious. The sauces really made the difference. Honestly, it's the best shawarma I've had in years.",
    attribution: "Mirel C.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "mihaela-r",
    quote:
      "Absolutely loved The Wrap Shack! My friend and I tried the shawarma and it was so fresh and delicious. The owner was super friendly and really cared about making it exactly how we liked. Such a great experience!",
    attribution: "Mihaela R.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "jack-nk",
    quote:
      "Delicious shawarma wraps! Fresh veg, everything was lovely — especially the sauces and meat. Will be back to try more.",
    attribution: "Jack Newton-Kelly",
    source: "Google review",
    rating: 5,
  },
  {
    id: "ursula-s",
    quote:
      "Amazing food! Super delicious and full of flavor. The service is fast and the owner is super nice and welcoming. Highly recommend — definitely coming back soon.",
    attribution: "Ursula S.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "constantin-c",
    quote: "Food is amazing, service is impeccable. Highly recommended.",
    attribution: "Constantin C.",
    source: "Google review",
    rating: 5,
  },
];
