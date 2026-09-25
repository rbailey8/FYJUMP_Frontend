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
  // A backend without limit support ignores ?limit and omits it from the report.
  const limitIgnored = result.requestedLimit !== null && r.limit === undefined;
  return (
    <div className="admin-result" role="status">
      <p className="admin-result-title">Refresh complete</p>
      {limitIgnored && (
        <p className="admin-warning">
          The API ignored the number of jobs and refreshed all of them. The backend needs the
          update that adds the limit option.
        </p>
      )}
      <dl className="admin-stats">
        <div><dt>Jobs on the board</dt><dd>{r.jobs_kept_us}</dd></div>
        <div><dt>Postings fetched</dt><dd>{r.jobs_fetched}</dd></div>
        <div><dt>Companies OK</dt><dd>{r.companies_ok} / {r.companies_total}</dd></div>
        <div><dt>Limit</dt><dd>{r.limit ?? "All"}</dd></div>
      </dl>
      {r.companies_failed.length > 0 && (
        <>
          <p className="admin-result-title">Companies that failed</p>
          <ul className="admin-failures">
            {r.companies_failed.map((f) => (
              <li key={f.company}>
                <strong>{f.company}</strong>: {f.error.split(" For more information")[0]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
