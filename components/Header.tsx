import Link from "next/link";
import { COACHING_URL, COURSES_URL, MARKETING_SITE_URL } from "@/lib/config";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <div className="header-left">
          <Link href="/" className="logo">
            <span className="logo-badge">Hiring</span>
            FYJUMP
          </Link>
          <nav className="nav-links">
            <Link href="/" className="nav-link active">Jobs</Link>
            <a href={COURSES_URL} className="nav-link">Courses</a>
            <a href={COACHING_URL} className="nav-link">Coaching</a>
            <a href={`${MARKETING_SITE_URL}/we-are-fyjump`} className="nav-link">About</a>
          </nav>
        </div>
        <a className="btn btn-yellow btn-sm" href={COACHING_URL} target="_blank" rel="noopener noreferrer">
          Book a Call
        </a>
      </div>
    </header>
  );
}
