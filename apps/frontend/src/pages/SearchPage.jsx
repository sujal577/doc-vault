import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import DocumentRow from "../components/ui/DocumentRow";
import { documents } from "../data/mockData";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const results = query
    ? documents.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.person.toLowerCase().includes(query) ||
          doc.type.toLowerCase().includes(query),
      )
    : [];

  return (
    <div>
      <PageHeader
        title="Search"
        description="Search documents, people, and ask questions in plain language."
      />

      <SearchInput autoFocus className="mb-3" />
      <p className="mb-8 text-sm text-vault-muted">
        Try a document name, a family member, or a natural-language query like &ldquo;passport
        expiring soon&rdquo;.
      </p>

      {query ? (
        results.length > 0 ? (
          <div>
            <p className="mb-4 text-sm text-vault-muted">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="space-y-1.5">
              {results.map((doc) => (
                <DocumentRow key={doc.id} document={doc} compact />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-vault-border-subtle bg-vault-surface px-6 py-12 text-center">
            <p className="font-medium text-vault-text">No results found</p>
            <p className="mt-2 text-sm text-vault-muted">
              Try a different search term or browse your documents.
            </p>
          </div>
        )
      ) : (
        <p className="text-sm text-vault-muted">Start typing to search across your vault.</p>
      )}
    </div>
  );
}
