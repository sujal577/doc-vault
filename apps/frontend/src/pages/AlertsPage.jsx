import PageHeader from "../components/ui/PageHeader";
import AlertItem from "../components/ui/AlertItem";
import { alerts } from "../data/mockData";

export default function AlertsPage() {
  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Documents approaching expiry that may need your attention."
      />

      {alerts.length > 0 ? (
        <div className="space-y-1.5">
          {alerts.map((alert) => (
            <div key={alert.id} id={alert.id}>
              <AlertItem alert={alert} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-vault-border-subtle bg-vault-surface px-6 py-12 text-center">
          <p className="font-medium text-vault-text">All clear</p>
          <p className="mt-2 text-sm text-vault-muted">
            No documents need attention right now.
          </p>
        </div>
      )}
    </div>
  );
}
