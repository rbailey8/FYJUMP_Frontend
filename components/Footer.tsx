import Link from "next/link";
import { COACHING_URL, COURSES_URL, MARKETING_SITE_URL } from "@/lib/config";

const FOOTER_CATEGORIES = ["AI/ML", "Fullstack", "Data Science", "Product", "Sales"];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">FYJUMP</p>
            <p className="footer-blurb">
              Tech jobs pulled daily from company career boards, plus courses and coaching to help
              you land them.
            </p>
          </div>
          <div>
            <p className="footer-heading">Opportunities</p>
            {FOOTER_CATEGORIES.map((c) => (
              <Link key={c} href={`/?category=${encodeURIComponent(c)}`}>{c}</Link>
            ))}
          </div>
          <div>
            <p className="footer-heading">Career Growth</p>
            <a href={COURSES_URL}>Job Search Course</a>
            <a href={COACHING_URL}>1:1 Coaching</a>
          </div>
          <div>
            <p className="footer-heading">FYJUMP</p>
            <a href={MARKETING_SITE_URL}>fyjump.com</a>
            <a href={`${MARKETING_SITE_URL}/we-are-fyjump`}>About</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} FYJUMP. All rights reserved.</span>
          <span className="footer-live">
            <span className="live-dot" />
            Refreshed daily from company career boards
          </span>
        </div>
      </div>
    </footer>
  );
}
