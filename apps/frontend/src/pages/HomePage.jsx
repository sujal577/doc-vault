import { Link } from "react-router-dom";
import Greeting from "../components/home/Greeting";
import SearchInput from "../components/ui/SearchInput";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import DocumentRow from "../components/ui/DocumentRow";
import AlertItem from "../components/ui/AlertItem";
import { documents, alerts } from "../data/mockData";
import { getRecentDocuments } from "../utils/helpers";

export default function HomePage() {
  const recentDocuments = getRecentDocuments(documents);
  const hasAlerts = alerts.length > 0;
  const hasDocuments = documents.length > 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      <section aria-label="Welcome">
        <Greeting />
        <p className="mt-1.5 text-[15px] text-vault-muted lg:mt-2">
          Everything you need, right where you left it.
        </p>
      </section>

      <section aria-label="Search">
        <SearchInput placeholder="Search your Vault..." />
      </section>

      <section aria-label="Quick actions">
        <Button icon="plus" size="lg" className="w-full sm:w-auto" aria-label="Add a new document">
          Add Document
        </Button>
      </section>

      {hasAlerts && (
        <section aria-label="Attention needed">
          <SectionHeader
            title="Needs attention"
            action={
              <Link
                to="/alerts"
                className="text-sm font-medium text-vault-accent transition-colors hover:text-vault-accent-hover"
              >
                View all
              </Link>
            }
          />
          <div className="space-y-1.5">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} compact />
            ))}
          </div>
        </section>
      )}

      <section aria-label="Recent documents">
        <SectionHeader
          title="Recent"
          action={
            hasDocuments ? (
              <Link
                to="/documents"
                className="text-sm font-medium text-vault-accent transition-colors hover:text-vault-accent-hover"
              >
                View all
              </Link>
            ) : null
          }
        />

        {recentDocuments.length > 0 ? (
          <div className="space-y-1.5">
            {recentDocuments.map((doc) => (
              <DocumentRow key={doc.id} document={doc} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-vault-border px-5 py-10 text-center">
            <p className="text-[15px] font-medium text-vault-text">Your vault is empty</p>
            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-vault-muted">
              Add your first document to start building a secure home for what matters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
