"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

interface Person {
  id: string;
  name: string;
  relation: string | null;
  documentCount: number;
}

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  async function load() {
    setPersons(await api<Person[]>("/persons"));
  }

  useEffect(() => {
    load();
  }, []);

  async function addPerson(e: React.FormEvent) {
    e.preventDefault();
    await api("/persons", { method: "POST", body: JSON.stringify({ name, relation: relation || undefined }) });
    setName("");
    setRelation("");
    load();
  }

  return (
    <AppShell>
      <h1 style={{ marginBottom: "1rem" }}>Persons</h1>
      <div className="card form" style={{ marginBottom: "1.5rem" }}>
        <h3>Add person</h3>
        <form onSubmit={addPerson}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Relation</label>
          <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="self, spouse, child…" />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </div>
      <div className="grid">
        {persons.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p className="muted">{p.relation ?? "—"}</p>
            <p>{p.documentCount} document(s)</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
