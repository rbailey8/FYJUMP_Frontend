import { COACHING_URL, COURSES_URL } from "@/lib/config";

export function CoachingBanner() {
  return (
    <div className="banner">
      <div className="banner-text">
        <p className="banner-eyebrow">1:1 Coaching</p>
        <p className="banner-title">Stuck between applying and getting offers?</p>
        <p className="banner-sub">
          Work directly with a FAANG-experienced coach on your resume, interview loop, and negotiation.
        </p>
      </div>
      <a className="banner-cta" href={COACHING_URL} target="_blank" rel="noopener noreferrer">
        Book a strategy call
      </a>
    </div>
  );
}

export function CoursesBanner() {
  return (
    <div className="banner">
      <div className="banner-text">
        <p className="banner-eyebrow">Job Search Course</p>
        <p className="banner-title">Behavioral, system design, and resume — one course.</p>
        <p className="banner-sub">
          Built from real interview loops at top tech companies. Self-paced.
        </p>
      </div>
      <a className="banner-cta" href={COURSES_URL} target="_blank" rel="noopener noreferrer">
        See the course
      </a>
    </div>
  );
}
