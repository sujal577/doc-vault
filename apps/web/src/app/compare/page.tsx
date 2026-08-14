"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  metadata: Record<string, unknown>;
  expiryDate: string | null;
  versions: { year: number; fileName: string }[];
}

export default function ComparePage() {
  const [allDocs, setAllDocs] = useState<Doc[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [compared, setCompared] = useState<Doc[]>([]);

  useEffect(() => {
    api<Doc[]>("/documents").then(setAllDocs);
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  async function compare() {
    if (selected.length < 2) return;
    const data = await api<Doc[]>(`/documents/compare?ids=${selected.join(",")}`);
    setCompared(data);
  }

  return (
    <AppShell>
      <h1 style={{ marginBottom: "1rem" }}>Side-by-side compare</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Select two documents to compare metadata and latest version side by side
      </p>
      <div className="card" style={{ marginBottom: "1rem" }}>
        {allDocs.map((d) => (
          <label key={d.id} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={selected.includes(d.id)}
              onChange={() => toggle(d.id)}
              style={{ width: "auto", marginRight: "0.5rem" }}
            />
            {d.title} ({DOCUMENT_TYPE_LABELS[d.type]})
          </label>
        ))}
        <button className="btn" onClick={compare} disabled={selected.length < 2} style={{ marginTop: "0.5rem" }}>
          Compare
        </button>
      </div>
      {compared.length >= 2 && (
        <div className="compare-grid">
          {compared.map((d) => (
            <div key={d.id} className="card">
              <h3>{d.title}</h3>
              <p className="muted">{DOCUMENT_TYPE_LABELS[d.type]} · {d.personName}</p>
              <p>Expiry: {d.expiryDate?.slice(0, 10) ?? "—"}</p>
              <pre style={{ fontSize: "0.8rem", overflow: "auto" }}>{JSON.stringify(d.metadata, null, 2)}</pre>
              {d.versions[0] && (
                <p className="muted">
                  Latest: {d.versions[0].year} — {d.versions[0].fileName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
