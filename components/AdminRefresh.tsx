"use client";

import { useActionState } from "react";
import { runRefresh, type RefreshResult } from "@/app/admin/actions";

export default function AdminRefresh() {
  const [result, formAction, pending] = useActionState<RefreshResult | null, FormData>(
    runRefresh,
    null
  );

  return (
    <>
      <form action={formAction} className="admin-panel">
        <h2>Refresh jobs</h2>
        <p className="admin-hint">
          Pulls fresh postings from every company&apos;s career board and replaces the jobs on the
          board. Leave the number blank to get all jobs.
        </p>

        <label htmlFor="limit">Number of jobs</label>
        <input
          id="limit"
          name="limit"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          placeholder="All jobs"
        />

        <label htmlFor="adminKey">Admin key</label>
        <input id="adminKey" name="adminKey" type="password" autoComplete="current-password" required />

        <button type="submit" disabled={pending}>
          {pending ? "Refreshing… (can take a few minutes)" : "Run refresh"}
        </button>
      </form>

      {result && <RefreshOutcome result={result} />}
    </>
  );
}

function RefreshOutcome({ result }: { result: RefreshResult }) {
  if (result.status === "error") {
    return <div className="admin-result error" role="alert">{result.message}</div>;
  }
  if (result.status === "running") {
    return <div className="admin-result" role="status">{result.message}</div>;
  }

  const r = result.report;
  const ok = r.status === "success";
  return (
    <div className={`admin-result${ok ? "" : " error"}`} role="status">
      <p className="admin-result-title">{ok ? "Refresh complete" : "Refresh failed"}</p>
      <dl className="admin-stats">
        <div><dt>Jobs processed</dt><dd>{r.jobs_processed}</dd></div>
        <div><dt>New jobs</dt><dd>{r.jobs_inserted}</dd></div>
        <div><dt>Updated jobs</dt><dd>{r.jobs_updated}</dd></div>
        <div><dt>Limit</dt><dd>{r.max_jobs ?? "All"}</dd></div>
      </dl>
      <p className="admin-hint">{r.message}</p>
    </div>
  );
}
