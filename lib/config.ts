// Central frontend config. Values pull from env so the same code works
// locally, on Vercel preview deployments, and on hiring.fyjump.com.

// Server-only: every API call runs on the Next.js server (never in the
// browser), so this can stay a private, non-NEXT_PUBLIC variable.
export const API_BASE_URL = (
  process.env.API_BASE_URL ||
  "http://fyjump-publi-f00i83ghqeiq-1767779632.us-east-1.elb.amazonaws.com"
).replace(/\/$/, "");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hiring.fyjump.com";

export const MARKETING_SITE_URL = "https://www.fyjump.com";
export const COURSES_URL = "https://www.fyjump.com/getting-started";
export const COACHING_URL = "https://calendly.com/rahmelabailey/strategy";

export const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "0–1 yrs (intern / new grad)" },
  { value: "2-3", label: "2–3 yrs" },
  { value: "4-5", label: "4–5 yrs (mid level)" },
  { value: "6+", label: "6+ yrs (senior)" },
];

export const CATEGORIES = [
  "AI/ML", "Cloud", "IT", "Cybersecurity", "Fullstack", "Backend", "Frontend",
  "Data Science", "Forward Deployed", "Product", "People-Facing", "Sales",
  "Marketing", "Other",
];

export const JOB_TYPES = ["Full-time", "Internship", "Apprenticeship"];

export const DATE_FILTERS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "week", label: "This week" },
  { value: "last_week", label: "Last week" },
  { value: "month", label: "This month" },
  { value: "older", label: "Older" },
];
