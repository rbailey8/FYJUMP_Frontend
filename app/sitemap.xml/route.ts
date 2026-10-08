import { getSitemapPage } from "@/lib/api";
import { getSiteUrl, JOBS_PER_SITEMAP } from "@/lib/config";

// Sitemap index: one file per JOBS_PER_SITEMAP live jobs, from the API's
// /jobs/sitemap. Per request (no incremental cache on Cloudflare), so it
// always reflects today's jobs; the job count it needs is cached for an hour.
export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const first = await getSitemapPage(1, 1);
  const files = Math.max(1, Math.ceil((first?.total ?? 0) / JOBS_PER_SITEMAP));
  const entries = Array.from(
    { length: files },
    (_, i) => `<sitemap><loc>${siteUrl}/sitemaps/jobs-${i + 1}.xml</loc></sitemap>`,
  ).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
