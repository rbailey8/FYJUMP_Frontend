import Link from "next/link";
import type { Job } from "@/lib/api";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const days = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (days < 1) return "Posted today";
  if (days < 2) return "Posted yesterday";
  if (days < 7) return `Posted ${Math.floor(days)}d ago`;
  return `Posted ${Math.floor(days / 7)}w ago`;
}

export default function JobCard({ job }: { job: Job }) {
  const days = job.date_posted ? (Date.now() - new Date(job.date_posted).getTime()) / 86400000 : 99;
  return (
    <Link href={`/jobs/${job.slug}`} className="job-card">
      <div>
        <p className="job-title">{job.title}</p>
        <div className="job-meta">
          <span>{job.company}</span>
          <span>{job.location}</span>
          <span>{timeAgo(job.date_posted)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {days < 1 && <span className="tag new">New</span>}
        <span className="tag">{job.category}</span>
        <span className="tag">{job.job_type}</span>
        <span className="tag">{job.experience_level} yrs</span>
      </div>
    </Link>
  );
}
