import { API_BASE_URL } from "./config";

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
  description_text: string;
  locations?: string[];
  apply_url: string;
  source: string;
};

export type JobSearchResult = {
  total: number;
  page: number;
  page_size: number;
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

const EMPTY_RESULT: JobSearchResult = { total: 0, page: 1, page_size: 20, items: [] };

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

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
