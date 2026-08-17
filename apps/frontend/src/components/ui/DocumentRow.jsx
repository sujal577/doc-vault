import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDate } from "../../utils/helpers";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  expiring: "bg-vault-warning-soft text-vault-warning",
  expired: "bg-red-50 text-red-700",
};

const statusLabels = {
  active: "Active",
  expiring: "Expiring soon",
  expired: "Expired",
};

export default function DocumentRow({ document, showChevron = true, compact = false }) {
  const { id, name, person, type, date, status } = document;

  return (
    <Link
      to={`/documents/${id}`}
      className={[
        "group flex items-center gap-3 rounded-lg border border-vault-border-subtle bg-vault-surface transition-all duration-150",
        "hover:border-vault-border hover:shadow-soft",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-accent",
        compact ? "px-3 py-2.5" : "px-4 py-3",
      ].join(" ")}
    >
      <div
        className={[
          "flex shrink-0 items-center justify-center rounded-md bg-vault-accent-soft text-vault-accent",
          compact ? "h-9 w-9" : "h-10 w-10 rounded-lg",
        ].join(" ")}
      >
        <Icon name="document" className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium leading-snug text-vault-text">{name}</p>
        <p className="mt-0.5 truncate text-sm leading-snug text-vault-muted">
          <span className="text-vault-text/80">{person}</span>
          <span className="mx-1.5 text-vault-border">·</span>
          <span>{type}</span>
        </p>
        <p className="mt-0.5 text-xs text-vault-muted/80">{formatDate(date)}</p>
      </div>

      {status && status !== "active" && (
        <span
          className={`hidden shrink-0 rounded-md px-2 py-0.5 text-xs font-medium sm:inline-block ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      )}

      {showChevron && (
        <Icon
          name="chevronRight"
          className="h-4 w-4 shrink-0 text-vault-muted/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-vault-muted"
        />
      )}
    </Link>
  );
}
