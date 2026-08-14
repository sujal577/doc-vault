"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import {
  api,
  downloadUrl,
  getToken,
  uploadDocumentVersion,
} from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  metadata: Record<string, unknown>;
  expiryDate: string | null;
  isFavorite: boolean;
  inTravelPack: boolean;
  tags: { name: string }[];
  versions: {
    id: string;
    year: number;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }[];
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [docNumber, setDocNumber] = useState("");

  async function load() {
    const d = await api<Doc>(`/documents/${id}`);
    setDoc(d);
    setExpiryDate(d.expiryDate ? d.expiryDate.slice(0, 10) : "");
    setDocNumber(typeof d.metadata?.number === "string" ? d.metadata.number : "");
  }

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  async function toggleFavorite() {
    if (!doc) return;
    await api(`/documents/${id}/favorite`, {
      method: "PATCH",
      body: JSON.stringify({ isFavorite: !doc.isFavorite }),
    });
    await load();
  }

  async function toggleTravel() {
    if (!doc) return;
    await api(`/documents/${id}/travel-pack`, {
      method: "PATCH",
      body: JSON.stringify({ inTravelPack: !doc.inTravelPack }),
    });
    await load();
  }

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api(`/documents/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          metadata: { ...(doc?.metadata ?? {}), number: docNumber || undefined },
          expiryDate: expiryDate || null,
        }),
      });
      setMessage("Details saved");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function uploadVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const result = await uploadDocumentVersion(id, file, year);
      setMessage(
        result.ocrExtracted
          ? `Uploaded ${result.fileName} — OCR text extracted`
          : `Uploaded ${result.fileName}`
      );
      setFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function openDownload(versionId: string, fileName: string) {
    const token = getToken();
    const res = await fetch(downloadUrl(id, versionId), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      setError("Download failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!doc) {
    return (
      <AppShell>
        {error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>}
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 style={{ marginBottom: "0.5rem" }}>{doc.title}</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        {DOCUMENT_TYPE_LABELS[doc.type]} · {doc.personName}
      </p>
      {error && <p className="error">{error}</p>}
      {message && <p className="muted" style={{ color: "var(--success)", marginBottom: "1rem" }}>{message}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <button className="btn secondary" onClick={toggleFavorite} style={{ marginRight: "0.5rem" }}>
          {doc.isFavorite ? "Unfavorite" : "Favorite"}
        </button>
        <button className="btn secondary" onClick={toggleTravel}>
          {doc.inTravelPack ? "Remove from Travel Pack" : "Add to Travel Pack"}
        </button>
      </div>

      <div className="card">
        <h3>Details</h3>
        <form onSubmit={saveDetails} className="form" style={{ maxWidth: 420 }}>
          <label>Document number</label>
          <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
          <label>Expiry date</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          <div style={{ marginBottom: "0.75rem" }}>
            {doc.tags.map((t) => (
              <span key={t.name} className="badge">
                {t.name}
              </span>
            ))}
          </div>
          <button className="btn" type="submit">
            Save details
          </button>
        </form>
        <pre style={{ fontSize: "0.85rem", overflow: "auto", marginTop: "1rem" }}>
          {JSON.stringify(doc.metadata, null, 2)}
        </pre>
      </div>

      <div className="card">
        <h3>Versions by year</h3>
        {doc.versions.length === 0 ? (
          <p className="muted">No files uploaded yet — upload below</p>
        ) : (
          <ul>
            {doc.versions.map((v) => (
              <li key={v.id} style={{ marginBottom: "0.5rem" }}>
                {v.year} — {v.fileName} ({Math.round(v.sizeBytes / 1024)} KB){" "}
                <button className="btn secondary" type="button" onClick={() => openDownload(v.id, v.fileName)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={uploadVersion} style={{ marginTop: "1rem" }} className="form">
          <label>Year</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <label>File (PNG/JPG recommended; PDF stores encrypted without OCR)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept="image/*,.pdf,application/pdf"
          />
          <button className="btn" type="submit" disabled={!file || uploading}>
            {uploading ? "Uploading…" : "Upload version"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
