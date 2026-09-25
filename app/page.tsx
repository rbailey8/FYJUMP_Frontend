import { Suspense } from "react";
import Filters from "@/components/Filters";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
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
      <section className="hero">
        <span className="badge badge-live">
          <span className="live-dot" />
          Live feed &middot; {results.total} open roles
        </span>
        <h1 className="hero-title">Tech jobs, straight off the wire.</h1>
        <p className="hero-sub">
          Pulled daily from Greenhouse, Lever, and Ashby career boards at FAANG, Fortune 500,
          and startup companies. US-based roles only.
        </p>
      </section>

      <Suspense fallback={null}>
        <Filters />
      </Suspense>

      <div className="promo-grid">
        <CoursesBanner />
        <CoachingBanner />
      </div>

      <div className="roles-head">
        <h2>
          Open Roles <span className="count">{results.total}</span>
        </h2>
        <span className="roles-sort">Newest first</span>
      </div>

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

      <Pagination
        page={results.page || Number(page)}
        pageSize={results.page_size || 20}
        total={results.total}
        searchParams={searchParams}
      />
    </>
  );
}
