import { getSitemapPage } from "@/lib/api";
import { getSiteUrl, JOBS_PER_SITEMAP } from "@/lib/config";

export const dynamic = "force-dynamic";

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** /sitemaps/jobs-N.xml: page N of live job URLs (expired jobs never appear). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = /^jobs-(\d+)\.xml$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });
  const page = Number(match[1]);
  const data = await getSitemapPage(page, JOBS_PER_SITEMAP);
  if (!data) return new Response("Sitemap unavailable", { status: 503 });
  if (page > 1 && data.items.length === 0) return new Response("Not found", { status: 404 });

  const siteUrl = getSiteUrl();
  const urls = data.items.map(
    (job) =>
      `<url><loc>${escapeXml(`${siteUrl}/jobs/${job.slug}`)}</loc>` +
      (job.updated_at ? `<lastmod>${job.updated_at}</lastmod>` : "") +
      `<changefreq>daily</changefreq></url>`,
  );
  if (page === 1) urls.unshift(`<url><loc>${siteUrl}</loc><changefreq>daily</changefreq></url>`);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
