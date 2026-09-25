import Link from "next/link";
import type { Job } from "@/lib/api";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const hours = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (hours < 1) return "Posted just now";
  if (hours < 24) return `Posted ${Math.floor(hours)}h ago`;
  const days = hours / 24;
  if (days < 2) return "Posted yesterday";
  if (days < 7) return `Posted ${Math.floor(days)}d ago`;
  return `Posted ${Math.floor(days / 7)}w ago`;
}

export default function JobCard({ job }: { job: Job }) {
  const isNew = job.date_posted
    ? Date.now() - new Date(job.date_posted).getTime() < 86400000
    : false;
  return (
    <article className="job-card">
      <div className="job-main">
        <p className="job-company">
          <strong>{job.company}</strong>
          <span className="job-location"> &bull; {job.location}</span>
          {isNew && <span className="pill pill-green">New</span>}
          {job.remote && <span className="pill pill-lavender">Remote</span>}
        </p>
        <h3 className="job-title">
          {/* Stretched link: the whole card opens the job page. */}
          <Link href={`/jobs/${job.slug}`} className="card-link">{job.title}</Link>
        </h3>
        <div className="job-tags">
          <span className="tag tag-yellow">{job.experience_level} yrs exp</span>
          <span className="tag">{job.category}</span>
          <span className="tag">{job.job_type}</span>
        </div>
      </div>
      <div className="job-side">
        <span className="job-posted">{timeAgo(job.date_posted)}</span>
        <a
          className={`btn btn-sm ${isNew ? "btn-yellow" : "btn-lavender"}`}
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now {"↗"}
        </a>
      </div>
    </article>
  );
}
