import Button from "./Button";

export default function EmptyState({ title, description, actionLabel = "Add Document", onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-vault-border px-6 py-12 text-center">
      <p className="font-medium text-vault-text">{title}</p>
      <p className="mt-2 text-sm text-vault-muted">{description}</p>
      <Button icon="plus" className="mt-6" aria-label={actionLabel} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
