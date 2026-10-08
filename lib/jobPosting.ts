import type { Job } from "./api";

// Builds Google's JobPosting `description`, which must be HTML, from the
// sections the API already splits into paragraphs and lists.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function descriptionHtml(job: Job): string {
  const sections = job.description_sections ?? [];
  if (sections.length === 0) {
    return (job.description_text || job.title)
      .split(/\n+/)
      .filter((line) => line.trim())
      .map((line) => `<p>${escapeHtml(line.trim())}</p>`)
      .join("");
  }
  return sections
    .map(
      (section) =>
        (section.heading && section.heading !== "Overview"
          ? `<h3>${escapeHtml(section.heading)}</h3>`
          : "") +
        (section.blocks ?? [])
          .map((block) =>
            block.type === "list"
              ? `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : `<p>${escapeHtml(block.text)}</p>`,
          )
          .join(""),
    )
    .join("");
}

// Location strings that name no place more specific than the country.
const COUNTRY_ONLY = new Set(["", "not specified", "united states", "usa", "us"]);

/** "Austin, TX; Chicago, IL" lists several offices: one Place each. */
export function jobPlaces(location: string) {
  return location
    .split(";")
    .map((loc) => loc.trim())
    .map((loc) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: COUNTRY_ONLY.has(loc.toLowerCase()) ? undefined : loc,
        addressCountry: "US",
      },
    }));
}
