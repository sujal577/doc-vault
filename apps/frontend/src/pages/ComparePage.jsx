import PageHeader from "../components/ui/PageHeader";
import { documents } from "../data/mockData";

export default function ComparePage() {
  return (
    <div>
      <PageHeader
        title="Compare"
        description="View compatible documents side by side across periods."
      />

      <div className="rounded-2xl border border-vault-border bg-vault-surface p-6 shadow-soft">
        <p className="text-[15px] text-vault-muted">
          Select two documents to compare their details and versions. This feature will be
          available once document selection is implemented.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <CompareSlot label="Document A" placeholder="Choose a document" />
          <CompareSlot label="Document B" placeholder="Choose a document" />
        </div>

        {documents.length > 0 && (
          <p className="mt-6 text-sm text-vault-muted">
            {documents.length} documents available for comparison.
          </p>
        )}
      </div>
    </div>
  );
}

function CompareSlot({ label, placeholder }) {
  return (
    <button
      type="button"
      className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-vault-border bg-vault-bg px-4 py-6 text-center transition-colors hover:border-vault-accent/40 hover:bg-vault-accent-soft/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-accent"
      aria-label={`${label}: ${placeholder}`}
    >
      <span className="text-sm font-medium text-vault-text">{label}</span>
      <span className="mt-1 text-sm text-vault-muted">{placeholder}</span>
    </button>
  );
}
