"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  expiryDate: string | null;
  isFavorite: boolean;
  inTravelPack: boolean;
  tags: { id: string; name: string }[];
  versions: { year: number }[];
}

interface Person {
  id: string;
  name: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [personId, setPersonId] = useState("");
  const [type, setType] = useState<DocumentType | "">("");
  const [title, setTitle] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [inTravelPack, setInTravelPack] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const [d, p] = await Promise.all([api<Doc[]>("/documents"), api<Person[]>("/persons")]);
      setDocs(d);
      setPersons(p);
      if (p.length && !personId) setPersonId(p[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!personId || !type) return;
    setSaving(true);
    setError("");
    try {
      const created = await api<{ id: string }>("/documents", {
        method: "POST",
        body: JSON.stringify({
          personId,
          type,
          title,
          metadata: docNumber ? { number: docNumber } : {},
          tagNames: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          expiryDate: expiryDate || undefined,
          isFavorite,
          inTravelPack,
        }),
      });
      setTitle("");
      setDocNumber("");
      setExpiryDate("");
      setTags("");
      setIsFavorite(false);
      setInTravelPack(false);
      router.push(`/documents/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <h1 style={{ marginBottom: "1rem" }}>Documents</h1>
      {error && <p className="error">{error}</p>}
      <div className="card form" style={{ maxWidth: 520, marginBottom: "1.5rem" }}>
        <h3>Add document</h3>
        <form onSubmit={createDoc}>
          <label>Person</label>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            <option value="">Select…</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as DocumentType)} required>
            <option value="">Select…</option>
            {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((t) => (
              <option key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Aadhaar Card" />
          <label>Document number (optional)</label>
          <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="XXXX-XXXX-1234" />
          <label>Expiry date (optional)</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          <label>Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="important, travel" />
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
            <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} style={{ width: "auto" }} />
            Favorite
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
            <input type="checkbox" checked={inTravelPack} onChange={(e) => setInTravelPack(e.target.checked)} style={{ width: "auto" }} />
            Add to travel pack
          </label>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create & upload file"}
          </button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Person</th>
            <th>Expiry</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              <td>
                <Link href={`/documents/${d.id}`}>{d.title}</Link>
              </td>
              <td>{DOCUMENT_TYPE_LABELS[d.type]}</td>
              <td>{d.personName}</td>
              <td>{d.expiryDate?.slice(0, 10) ?? "—"}</td>
              <td>
                {d.isFavorite && <span className="badge">★</span>}
                {d.inTravelPack && <span className="badge success">Travel</span>}
                {d.versions[0] && <span className="badge">{d.versions[0].year}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}
