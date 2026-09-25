import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoachingBanner } from "@/components/Banner";
import { getJobBySlug } from "@/lib/api";
import { SITE_URL } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};
  const title = `${job.title} at ${job.company}`;
  const description = `${job.title} — ${job.company}, ${job.location}. ${job.job_type}, ${job.experience_level} years experience.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/jobs/${job.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "Full-time": "FULL_TIME",
  Internship: "INTERN",
  Apprenticeship: "OTHER",
};

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  // Google Jobs structured data — this is what makes the posting eligible
  // to appear in Google's job search surface.
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description_text || job.title,
    datePosted: job.date_posted || undefined,
    employmentType: EMPLOYMENT_TYPE_MAP[job.job_type] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: job.remote
      ? undefined
      : {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "US" },
        },
    applicantLocationRequirements: job.remote
      ? { "@type": "Country", name: "USA" }
      : undefined,
    jobLocationType: job.remote ? "TELECOMMUTE" : undefined,
    directApply: false,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="job-detail-header">
        <p className="company-name">{job.company}</p>
        <h1 className="page-title">{job.title}</h1>
        <p className="job-meta">
          {job.location} &middot; {job.job_type} &middot; {job.experience_level} yrs &middot; {job.category}
        </p>
      </div>

      <div className="job-body">
        <div className="job-description">
          {job.description_text || "See full details via Apply."}
        </div>
      </div>
      <div style={{ padding: "0 0 32px" }}>
        <a className="apply-btn" href={job.apply_url} target="_blank" rel="noopener noreferrer">
          Apply on {job.company} {"\u2192"}
        </a>
      </div>

      <CoachingBanner />
    </>
  );
}
