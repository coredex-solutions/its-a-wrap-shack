/**
 * CMS content schemas — the single definition of what the admin panel may
 * write and what the site will accept at runtime. Mirrors the shapes of the
 * seed files in `content/`, with literal types widened for editability.
 */

import { z } from "zod";

export const CATEGORY_IDS = [
  "wraps",
  "bowls",
  "plates",
  "grill",
  "bakery",
  "mezza",
  "salads",
  "sides",
  "sweets",
  "drinks",
] as const;

export const DIETARY = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "contains-nuts",
] as const;

export const categoryIdSchema = z.enum(CATEGORY_IDS);
export const dietarySchema = z.enum(DIETARY);

export const menuCategorySchema = z.object({
  id: categoryIdSchema,
  label: z.string().min(1),
  note: z.string().optional(),
});

export const menuItemSchema = z.object({
  id: z.string().min(1),
  category: categoryIdSchema,
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative().nullable(),
  priceNote: z.string().optional(),
  image: z.string().optional(),
  dietary: z.array(dietarySchema),
  featured: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  attribution: z.string().min(1),
  source: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const siteEditableSchema = z.object({
  cloverUrl: z.string().url(),
  phone: z.string().min(7),
  phoneHref: z.string().startsWith("tel:"),
  email: z.string().email(),
  hours: z.object({
    opens: z.string().regex(/^\d{2}:\d{2}$/),
    closes: z.string().regex(/^\d{2}:\d{2}$/),
    display: z.string().min(1),
    orderingWindow: z.string().min(1),
  }),
  socials: z.object({
    instagram: z.string().url().nullable(),
    facebook: z.string().url().nullable(),
  }),
});

/**
 * The overlay file (`data/cms/content.json`): every section optional; a
 * present section replaces its seed wholesale (no per-field deep merge —
 * the editors always submit complete sections).
 */
export const overlaySchema = z.object({
  savedAt: z.string().optional(),
  site: siteEditableSchema.optional(),
  categories: z.array(menuCategorySchema).optional(),
  menu: z.array(menuItemSchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  faq: z.array(faqItemSchema).optional(),
});

export type SiteEditable = z.infer<typeof siteEditableSchema>;
export type Overlay = z.infer<typeof overlaySchema>;
