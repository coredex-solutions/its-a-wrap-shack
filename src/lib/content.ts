/**
 * Thin accessor layer over the typed content files.
 * Components import from HERE, never from `content/*` directly, so a future
 * CMS (Cloudflare D1 + R2) can replace the source without touching components.
 */

import { site, CLOVER_ORDER_URL } from "@content/site";
import {
  categories,
  menu,
  type CategoryId,
  type Dietary,
  type MenuCategory,
  type MenuItem,
} from "@content/menu";
import { testimonials, type Testimonial } from "@content/testimonials";
import { faq, type FaqItem } from "@content/faq";

export type { CategoryId, Dietary, MenuCategory, MenuItem, Testimonial, FaqItem };

export function getSite() {
  return site;
}

export function getCloverUrl() {
  return CLOVER_ORDER_URL;
}

export function getCategories(): MenuCategory[] {
  return categories;
}

export function getMenu(): MenuItem[] {
  return menu;
}

export function getMenuByCategory(id: CategoryId): MenuItem[] {
  return menu.filter((m) => m.category === id);
}

export function getFeaturedItems(): MenuItem[] {
  return menu.filter((m) => m.featured);
}

/** Curated homepage preview: a spread across categories, featured first. */
export function getMenuPreview(count = 8): MenuItem[] {
  const featured = menu.filter((m) => m.featured);
  const rest = menu.filter((m) => !m.featured);
  return [...featured, ...rest].slice(0, count);
}

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getFaq(): FaqItem[] {
  return faq;
}

export function formatPrice(item: MenuItem): string {
  if (item.price === null) return "ask in store";
  const dollars = item.price.toFixed(2).replace(/\.00$/, "");
  return item.priceNote
    ? `${item.priceNote} $${dollars}`
    : `$${dollars}`;
}
