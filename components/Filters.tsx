"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, DATE_FILTERS, EXPERIENCE_LEVELS, JOB_TYPES } from "@/lib/config";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/?${next.toString()}`);
  }

  return (
    <form
      className="filters"
      onSubmit={(e) => {
        e.preventDefault();
        update("q", q);
      }}
    >
      <input
        type="text"
        placeholder="Search title, company, location..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select defaultValue={params.get("category") || ""} onChange={(e) => update("category", e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select defaultValue={params.get("experience_level") || ""} onChange={(e) => update("experience_level", e.target.value)}>
        <option value="">All experience</option>
        {EXPERIENCE_LEVELS.map((l) => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>
      <select defaultValue={params.get("job_type") || ""} onChange={(e) => update("job_type", e.target.value)}>
        <option value="">All job types</option>
        {JOB_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select defaultValue={params.get("date_posted") || ""} onChange={(e) => update("date_posted", e.target.value)}>
        <option value="">Any time</option>
        {DATE_FILTERS.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
