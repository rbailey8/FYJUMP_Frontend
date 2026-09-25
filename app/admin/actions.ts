"use server";

import { API_BASE_URL } from "@/lib/config";

export type RefreshReport = {
  companies_total: number;
  companies_ok: number;
  companies_failed: { company: string; error: string }[];
  jobs_fetched: number;
  jobs_kept_us: number;
  limit?: number | null;
};

export type RefreshResult =
  | { status: "done"; report: RefreshReport; requestedLimit: number | null }
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

  const url = `${API_BASE_URL}/jobs/refresh${limit ? `?limit=${limit}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      cache: "no-store",
    });
  } catch {
    return { status: "error", message: "Couldn't reach the API. The backend may be down." };
  }

  if (res.ok) {
    return { status: "done", report: await res.json(), requestedLimit: limit };
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
