import { API_BASE_URL } from "./config";

// Structured by the API; the frontend only renders it.
export type DescriptionBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type DescriptionSection = {
  heading: string;
  blocks: DescriptionBlock[];
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  category: string;
  experience_level: string;
  job_type: string;
  date_posted: string | null;
  // Employer's end date (some Workday jobs); expired jobs are never returned.
  valid_through?: string | null;
  // Only on single-job responses (GET /jobs/slug/{slug}); list responses
  // leave descriptions out.
  description_text?: string;
  description_sections?: DescriptionSection[];
  locations?: string[];
  apply_url: string;
  source: string;
};

export type JobSearchResult = {
  page: number;
  page_size: number;
  // True when another page follows; the API doesn't count matching jobs.
  has_more: boolean;
  items: Job[];
};

export type SearchParams = {
  q?: string;
  category?: string;
  experience_level?: string;
  job_type?: string;
  location?: string;
  date_posted?: string;
  page?: string;
  page_size?: string;
};

const EMPTY_RESULT: JobSearchResult = { page: 1, page_size: 20, has_more: false, items: [] };

export async function searchJobs(params: SearchParams): Promise<JobSearchResult> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  try {
    const res = await fetch(`${API_BASE_URL}/jobs?${qs.toString()}`, {
      // Job list refreshes a few times a day — a short revalidate window keeps
      // pages fast while staying close to current.
      next: { revalidate: 300 },
    });
    if (!res.ok) return EMPTY_RESULT;
    return await res.json();
  } catch {
    // Backend unreachable (e.g. not started yet, or during build) — degrade
    // gracefully instead of failing the whole page/build.
    return EMPTY_RESULT;
  }
}

/** "/jobs/<readable text>-<uuid>". Only the uuid at the end is used to load
 *  the job; the text (the API's slug minus its 8-character id suffix) is for
 *  people and search engines. */
export function jobPath(job: { id: string; slug: string }): string {
  return `/jobs/${job.slug.replace(/-[0-9a-f]{8}$/, "")}-${job.id}`;
}

/** The uuid at the end of a jobPath() URL segment. */
export function jobIdFromPath(segment: string): string {
  return segment.slice(-36);
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type SitemapPage = {
  total: number;
  page: number;
  page_size: number;
  items: { id: string; slug: string; updated_at: string | null }[];
};

/** One page of live job slugs (GET /jobs/sitemap); null when the API is unreachable. */
export async function getSitemapPage(page: number, pageSize: number): Promise<SitemapPage | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/sitemap?page=${page}&page_size=${pageSize}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
