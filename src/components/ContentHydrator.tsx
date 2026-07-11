"use client";

import { __setContent, type ContentBundle } from "@/lib/content";

/**
 * Primes the client-side content snapshot before any descendant renders,
 * so every client component's `@/lib/content` accessors return the same
 * CMS-merged bundle the server rendered with. Deliberately set during
 * render (not an effect): descendants read the snapshot in their render.
 * Idempotent, so Strict Mode double-rendering is harmless.
 */
export default function ContentHydrator({
  data,
  children,
}: {
  data: ContentBundle;
  children: React.ReactNode;
}) {
  __setContent(data);
  return children;
}
