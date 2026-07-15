import type { NextConfig } from "next";

// When R2 is configured, menu photos are served from its public domain and
// next/image needs it allow-listed. Malformed URLs should fail the build
// loudly, not silently skip the pattern.
function r2RemotePatterns() {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) return {};
  let hostname: string;
  try {
    hostname = new URL(base).hostname;
  } catch {
    throw new Error(`R2_PUBLIC_URL is not a valid URL: ${base}`);
  }
  return {
    remotePatterns: [{ protocol: "https" as const, hostname, pathname: "/**" }],
  };
}

const nextConfig: NextConfig = {
  // native module — must stay external to the server bundle
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // menu photo uploads arrive through a server action; the 1 MB default
    // would reject most phone photos
    serverActions: { bodySizeLimit: "10mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    ...r2RemotePatterns(),
  },
};

export default nextConfig;
