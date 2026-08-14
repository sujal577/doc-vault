"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  inTravelPack: boolean;
  isFavorite: boolean;
}

export default function TravelPackPage() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    api<Doc[]>("/documents?travelPack=true").then(setDocs);
  }, []);

  return (
    <AppShell>
      <h1 style={{ marginBottom: "0.5rem" }}>Travel Pack</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Documents marked for travel — favorites and essentials in one place
      </p>
      {docs.length === 0 ? (
        <p className="muted">No documents in travel pack. Mark documents from their detail page.</p>
      ) : (
        <div className="grid">
          {docs.map((d) => (
            <div key={d.id} className="card">
              <h3>
                <Link href={`/documents/${d.id}`}>{d.title}</Link>
              </h3>
              <p className="muted">
                {DOCUMENT_TYPE_LABELS[d.type]} · {d.personName}
              </p>
              {d.isFavorite && <span className="badge">★ Favorite</span>}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
