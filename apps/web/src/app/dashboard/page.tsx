"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DashboardStats } from "@doc-vault/shared";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<DashboardStats>("/dashboard")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <AppShell>
      <h1 style={{ marginBottom: "1rem" }}>Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {stats && (
        <>
          <div className="grid" style={{ marginBottom: "1.5rem" }}>
            <div className="card">
              <p className="muted">Documents</p>
              <p className="stat">{stats.totalDocuments}</p>
            </div>
            <div className="card">
              <p className="muted">Persons</p>
              <p className="stat">{stats.totalPersons}</p>
            </div>
            <div className="card">
              <p className="muted">Favorites</p>
              <p className="stat">{stats.favoritesCount}</p>
            </div>
            <div className="card">
              <p className="muted">Travel Pack</p>
              <p className="stat">{stats.travelPackCount}</p>
            </div>
          </div>

          <div className="card">
            <h3>Expiring soon (90 days)</h3>
            {stats.expiringSoon.length === 0 ? (
              <p className="muted">None</p>
            ) : (
              <ul>
                {stats.expiringSoon.map((d) => (
                  <li key={d.id}>
                    <Link href={`/documents/${d.id}`}>{d.title}</Link> — {d.personName}
                    <span className="badge warning">{d.expiryDate?.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Expired</h3>
            {stats.expired.length === 0 ? (
              <p className="muted">None</p>
            ) : (
              <ul>
                {stats.expired.map((d) => (
                  <li key={d.id}>
                    <Link href={`/documents/${d.id}`}>{d.title}</Link> — {d.personName}
                    <span className="badge danger">{d.expiryDate?.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Missing documents</h3>
            {stats.missingByPerson.length === 0 ? (
              <p className="muted">All recommended docs present</p>
            ) : (
              stats.missingByPerson.map((m) => (
                <div key={m.personId} style={{ marginBottom: "0.75rem" }}>
                  <strong>{m.personName}</strong>
                  <div>
                    {m.missingTypes.map((t) => (
                      <span key={t} className="badge">
                        {DOCUMENT_TYPE_LABELS[t]}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
