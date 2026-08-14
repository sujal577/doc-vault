"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Result {
  id: string;
  title: string;
  type: DocumentType;
  personName: string;
  expiryDate: string | null;
  tags: string[];
  latestYear: number | null;
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const data = await api<Result[]>(`/search?${params}`);
    setResults(data);
    setSearched(true);
  }

  return (
    <AppShell>
      <h1 style={{ marginBottom: "1rem" }}>Search</h1>
      <form className="card form" onSubmit={search} style={{ marginBottom: "1.5rem" }}>
        <label>Search title, type, person, metadata, OCR text, tags</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="aadhaar, insurance, tax…" />
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      {searched && results.length === 0 && <p className="muted">No results</p>}
      <div className="grid">
        {results.map((r) => (
          <div key={r.id} className="card">
            <h3>
              <Link href={`/documents/${r.id}`}>{r.title}</Link>
            </h3>
            <p className="muted">
              {DOCUMENT_TYPE_LABELS[r.type]} · {r.personName}
            </p>
            {r.latestYear && <span className="badge">{r.latestYear}</span>}
            {r.tags.map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
