import type { MetadataRoute } from "next";
import { searchJobs } from "@/lib/api";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

// The API caps page_size at 100, so walk the pages until we have every job.
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const results = await searchJobs({ page: String(page), page_size: String(PAGE_SIZE) });
    jobs.push(...results.items);
    if (results.items.length < PAGE_SIZE || jobs.length >= results.total) break;
  }
  const jobUrls = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.date_posted || undefined,
    changeFrequency: "daily" as const,
  }));
  return [{ url: SITE_URL, changeFrequency: "daily" as const }, ...jobUrls];
}
