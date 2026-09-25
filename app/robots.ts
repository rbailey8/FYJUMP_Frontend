import type { MetadataRoute } from "next";
import { allowIndexing, getSiteUrl } from "@/lib/config";

// Rendered per request so it reflects this deployment's SITE_URL and
// ALLOW_INDEXING (test sites block all crawlers).
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
