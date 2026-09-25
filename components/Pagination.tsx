import Link from "next/link";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  searchParams: Record<string, string | undefined>;
};

// 1 … 4 5 6 … 12: first, last, and the pages around the current one.
function pageList(current: number, last: number): (number | "…")[] {
  const pages = [...new Set([1, current - 1, current, current + 1, last])]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, pageSize, total, searchParams }: Props) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function href(p: number) {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") qs.set(k, v);
    });
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/?${s}` : "/";
  }

  return (
    <nav className="pagination" aria-label="Pages">
      <span className="pagination-info">
        Showing {from}–{to} of {total} roles
      </span>
      {last > 1 && (
        <div className="pagination-pages">
          {page > 1 && <Link href={href(page - 1)} className="page-btn" aria-label="Previous page">&lsaquo;</Link>}
          {pageList(page, last).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="page-gap">…</span>
            ) : (
              <Link
                key={p}
                href={href(p)}
                className={`page-btn${p === page ? " current" : ""}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Link>
            )
          )}
          {page < last && <Link href={href(page + 1)} className="page-btn" aria-label="Next page">&rsaquo;</Link>}
        </div>
      )}
    </nav>
  );
}
