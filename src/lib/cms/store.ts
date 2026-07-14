/**
 * CMS store — server only (uses fs; never import from client components).
 *
 * Content lives as a JSON overlay at `data/cms/content.json`, written by the
 * admin panel. Sections present in the overlay replace their seed from
 * `content/*` wholesale; missing sections fall back to the seed, so the site
 * runs identically with no overlay file at all.
 *
 * NOTE: requires a persistent Node server (`next start`). On ephemeral
 * serverless filesystems, edits will not survive a redeploy.
 */

import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import {
  defaultBundle,
  __setContent,
  type ContentBundle,
  type SiteData,
} from "@/lib/content";
import { overlaySchema, type Overlay } from "./schema";

const FILE = path.join(process.cwd(), "data", "cms", "content.json");

async function readOverlay(): Promise<Overlay | null> {
  let raw: string;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch {
    return null; // no overlay yet — seeds only
  }
  try {
    const parsed = overlaySchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
    console.error("[cms] overlay failed validation — using seeds:", parsed.error.message);
  } catch (e) {
    console.error("[cms] overlay is not valid JSON — using seeds:", e);
  }
  return null;
}

function mergeSite(base: SiteData, o: NonNullable<Overlay["site"]>): SiteData {
  return {
    ...base,
    phone: o.phone,
    phoneHref: o.phoneHref,
    email: o.email,
    hours: { ...base.hours, ...o.hours },
    socials: o.socials,
  };
}

/**
 * Merged content for the current request (deduped via React cache). Also
 * primes the accessor snapshot in `lib/content.ts`, so call this at the top
 * of every page/layout that renders content.
 */
export const loadContent = cache(async (): Promise<ContentBundle> => {
  const overlay = await readOverlay();
  const bundle: ContentBundle = !overlay
    ? defaultBundle
    : {
        site: overlay.site
          ? mergeSite(defaultBundle.site, overlay.site)
          : defaultBundle.site,
        cloverUrl: overlay.site?.cloverUrl ?? defaultBundle.cloverUrl,
        categories: overlay.categories ?? defaultBundle.categories,
        menu: overlay.menu ?? defaultBundle.menu,
        testimonials: overlay.testimonials ?? defaultBundle.testimonials,
        faq: overlay.faq ?? defaultBundle.faq,
        catering: overlay.catering ?? defaultBundle.catering,
        cateringLeadTime: overlay.cateringLeadTime ?? defaultBundle.cateringLeadTime,
      };
  __setContent(bundle);
  return bundle;
});

/** Merge a partial overlay into the file (atomic write via tmp + rename). */
export async function saveOverlaySection(patch: Partial<Overlay>): Promise<void> {
  const existing = (await readOverlay()) ?? {};
  const next: Overlay = {
    ...existing,
    ...patch,
    savedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

/** Overlay metadata for the admin dashboard. */
export async function overlayStatus(): Promise<{
  exists: boolean;
  savedAt: string | null;
}> {
  const overlay = await readOverlay();
  return { exists: overlay !== null, savedAt: overlay?.savedAt ?? null };
}
