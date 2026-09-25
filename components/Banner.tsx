import { COACHING_URL, COURSES_URL } from "@/lib/config";

export function CoursesBanner() {
  return (
    <div className="promo promo-pink">
      <span className="promo-eyebrow">Job Search Course</span>
      <p className="promo-title">Behavioral, system design, and resume — one course.</p>
      <p className="promo-sub">Built from real interview loops at top tech companies. Self-paced.</p>
      <a className="btn btn-yellow" href={COURSES_URL} target="_blank" rel="noopener noreferrer">
        See the course {"→"}
      </a>
    </div>
  );
}

export function CoachingBanner() {
  return (
    <div className="promo promo-green">
      <span className="promo-eyebrow">1:1 Coaching</span>
      <p className="promo-title">Stuck between applying and getting offers?</p>
      <p className="promo-sub">
        Work directly with a FAANG-experienced coach on your resume, interview loop, and negotiation.
      </p>
      <a className="btn btn-dark" href={COACHING_URL} target="_blank" rel="noopener noreferrer">
        Book a strategy call
      </a>
    </div>
  );
}
