import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo">
          FY<span>JUMP</span> · HIRING
        </Link>
        <nav className="nav-links">
          <Link href="/">Jobs</Link>
          <a href="https://www.fyjump.com/getting-started">Courses</a>
          <a href="https://www.fyjump.com/we-are-fyjump">About</a>
        </nav>
      </div>
    </header>
  );
}
