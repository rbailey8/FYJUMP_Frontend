import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoachingBanner } from "@/components/Banner";
import { getJobBySlug } from "@/lib/api";
import { getSiteUrl } from "@/lib/config";

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
    alternates: { canonical: `${getSiteUrl()}/jobs/${job.slug}` },
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

      <Link href="/" className="back-link">&larr; All jobs</Link>

      <article className="detail-card">
        <p className="job-company">
          <strong>{job.company}</strong>
          <span className="job-location"> &bull; {job.location}</span>
          {job.remote && <span className="pill pill-lavender">Remote</span>}
        </p>
        <h1 className="detail-title">{job.title}</h1>
        <div className="job-tags">
          <span className="tag tag-yellow">{job.experience_level} yrs exp</span>
          <span className="tag">{job.category}</span>
          <span className="tag">{job.job_type}</span>
        </div>
        <a className="btn btn-yellow detail-apply" href={job.apply_url} target="_blank" rel="noopener noreferrer">
          Apply on {job.company} {"\u2197"}
        </a>
        <div className="job-description">
          {job.description_text || "See full details via Apply."}
        </div>
      </article>

      <div className="detail-promo">
        <CoachingBanner />
      </div>
    </>
  );
}
