import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import DocumentRow from "../components/ui/DocumentRow";
import { documents } from "../data/mockData";
import EmptyState from "../components/ui/EmptyState";

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="All your stored documents, organized and easy to find."
      >
        <Button icon="plus" aria-label="Add a new document">
          Add Document
        </Button>
      </PageHeader>

      {documents.length > 0 ? (
        <div className="space-y-1.5">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} compact />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No documents yet"
          description="Add your first document to start building your vault."
        />
      )}
    </div>
  );
}
