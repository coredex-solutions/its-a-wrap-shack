import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
