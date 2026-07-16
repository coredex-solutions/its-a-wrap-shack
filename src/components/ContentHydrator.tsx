"use client";

import { __setContent, type ContentBundle } from "@/lib/content";

/**
 * Primes the client-side content snapshot before any descendant renders,
 * so every client component's `@/lib/content` accessors return the same
 * CMS-merged bundle the server rendered with. Deliberately set during
 * render (not an effect): descendants read the snapshot in their render.
 * Idempotent, so Strict Mode double-rendering is harmless.
 *
 * Pass ONLY the sections the page's client components read — the layout
 * hydrates {site, cloverUrl} for the chrome; pages layer their own needs
 * (home: menu + testimonials; menu: menu + categories). Unhydrated sections
 * fall back to the compiled-in seeds, which no client component reads.
 */
export default function ContentHydrator({
  data,
  children,
}: {
  data: Partial<ContentBundle>;
  children: React.ReactNode;
}) {
  __setContent(data);
  return children;
}
