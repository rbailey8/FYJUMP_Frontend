import Link from "next/link";

type Props = {
  page: number;
  hasMore: boolean;
  searchParams: Record<string, string | undefined>;
};

// ‹ Page 3 ›: the API doesn't count matching jobs, so only previous/next.
export default function Pagination({ page, hasMore, searchParams }: Props) {
  function href(p: number) {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") qs.set(k, v);
    });
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/?${s}` : "/";
  }

  if (page <= 1 && !hasMore) return null;

  return (
    <nav className="pagination" aria-label="Pages">
      <span className="pagination-info">Page {page}</span>
      <div className="pagination-pages">
        {page > 1 && <Link href={href(page - 1)} className="page-btn" aria-label="Previous page">&lsaquo;</Link>}
        <span className="page-btn current" aria-current="page">{page}</span>
        {hasMore && <Link href={href(page + 1)} className="page-btn" aria-label="Next page">&rsaquo;</Link>}
      </div>
    </nav>
  );
}
