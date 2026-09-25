import { Suspense } from "react";
import Filters from "@/components/Filters";
import JobCard from "@/components/JobCard";
import { CoachingBanner, CoursesBanner } from "@/components/Banner";
import { searchJobs } from "@/lib/api";

export const revalidate = 300;

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function HomePage(props: Props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page || "1";
  const results = await searchJobs({ ...searchParams, page });

  return (
    <>
      <p className="feed-label">
        <span className="feed-dot" />
        Live feed &middot; {results.total} open roles
      </p>
      <h1 className="page-title">Tech jobs, straight off the wire.</h1>
      <p className="page-sub">
        Pulled daily from Greenhouse, Lever, and Ashby career boards at FAANG, Fortune 500,
        and startup companies. US-based roles only.
      </p>

      <Suspense fallback={null}>
        <Filters />
      </Suspense>

      <CoursesBanner />

      {results.items.length === 0 ? (
        <div className="empty-state">
          No roles match those filters yet. Try widening your search, or check back soon —
          the board refreshes daily.
        </div>
      ) : (
        <div className="job-list">
          {results.items.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <CoachingBanner />
    </>
  );
}
