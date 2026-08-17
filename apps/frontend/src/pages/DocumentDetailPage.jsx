import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { documents } from "../data/mockData";
import { formatDate } from "../utils/helpers";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const document = documents.find((d) => d.id === id);

  if (!document) {
    return (
      <div className="text-center">
        <PageHeader title="Document not found" description="This document doesn't exist in your vault." />
        <Link
          to="/documents"
          className="text-sm font-medium text-vault-accent hover:text-vault-accent-hover"
        >
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/documents"
        className="mb-6 inline-block text-sm font-medium text-vault-muted transition-colors hover:text-vault-accent"
      >
        ← Documents
      </Link>

      <PageHeader title={document.name} description={`${document.type} · ${document.person}`} />

      <dl className="overflow-hidden rounded-xl border border-vault-border bg-vault-surface shadow-soft">
        {[
          { label: "Person", value: document.person },
          { label: "Type", value: document.type },
          { label: "Date", value: formatDate(document.date) },
          { label: "Status", value: document.status },
        ].map((field, index) => (
          <div
            key={field.label}
            className={[
              "flex justify-between gap-4 px-4 py-3.5",
              index < 3 ? "border-b border-vault-border-subtle" : "",
            ].join(" ")}
          >
            <dt className="text-sm text-vault-muted">{field.label}</dt>
            <dd className="text-sm font-medium capitalize text-vault-text">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
