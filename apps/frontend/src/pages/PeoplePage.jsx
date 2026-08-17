import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import PersonChip from "../components/ui/PersonChip";
import { people as mockPeople } from "../data/mockData";
import EmptyState from "../components/ui/EmptyState";
import { fetchMembers } from "../services/members";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      try {
        const members = await fetchMembers();
        if (!cancelled) {
          setPeople(members);
          setUsingFallback(false);
        }
      } catch {
        if (!cancelled) {
          setPeople(mockPeople);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="People"
        description="Organize documents by family member."
      >
        <Button variant="secondary" aria-label="Add a person">
          Add Person
        </Button>
      </PageHeader>

      {usingFallback && (
        <p className="mb-4 rounded-lg border border-vault-border-subtle bg-vault-surface px-4 py-3 text-sm text-vault-muted">
          Showing local data — connect the API to load members from your vault.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-vault-muted">Loading people…</p>
      ) : people.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {people.map((person) => (
            <PersonChip key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No people added"
          description="Add family members to organize documents by person."
          actionLabel="Add Person"
        />
      )}
    </div>
  );
}
