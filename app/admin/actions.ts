"use server";

import { API_BASE_URL } from "@/lib/config";

// Response of the ingestion service's POST /admin/jobs/refresh.
export type RefreshReport = {
  status: string;
  max_jobs: number | null;
  jobs_processed: number;
  jobs_inserted: number;
  jobs_updated: number;
  jobs_skipped: number;
  message: string;
};

export type RefreshResult =
  | { status: "done"; report: RefreshReport }
  | { status: "running"; message: string }
  | { status: "error"; message: string };

// Runs on the server only: the admin key the admin typed is forwarded to the
// API as x-admin-key and never stored or shipped in the site's JavaScript.
export async function runRefresh(
  _prev: RefreshResult | null,
  formData: FormData
): Promise<RefreshResult> {
  const adminKey = String(formData.get("adminKey") || "").trim();
  const limitRaw = String(formData.get("limit") || "").trim();

  if (!adminKey) return { status: "error", message: "Enter the admin key." };

  // Blank means "run every company and keep every job".
  let limit: number | null = null;
  if (limitRaw) {
    if (!/^\d+$/.test(limitRaw) || Number(limitRaw) < 1) {
      return { status: "error", message: "Number of jobs must be a whole number above 0, or blank for all." };
    }
    limit = Number(limitRaw);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/admin/jobs/refresh`, {
      method: "POST",
      headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify({ max_jobs: limit }),
      cache: "no-store",
    });
  } catch {
    return { status: "error", message: "Couldn't reach the API. The backend may be down." };
  }

  if (res.ok) {
    return { status: "done", report: await res.json() };
  }

  const detail = await res
    .json()
    .then((body) => (typeof body?.detail === "string" ? body.detail : ""))
    .catch(() => "");

  if (res.status === 401) return { status: "error", message: "Wrong admin key." };
  if (res.status === 504) {
    // The load balancer stops waiting after ~60s, but the backend keeps
    // working through the companies in the background.
    return {
      status: "running",
      message:
        "The refresh is still running on the server (it takes longer than the connection allows). Check the job board again in a few minutes.",
    };
  }
  if (detail) return { status: "error", message: `Refresh failed (${res.status}): ${detail}` };
  if (res.status === 502 || res.status === 503) {
    return { status: "error", message: `The API is unavailable (${res.status}). The backend may be down.` };
  }
  return { status: "error", message: `Refresh failed with status ${res.status}.` };
}
