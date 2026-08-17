import { Link } from "react-router-dom";
import Icon from "./Icon";

const severityStyles = {
  warning: "border-amber-200/80 bg-vault-warning-soft",
  info: "border-vault-border bg-vault-surface",
};

export default function AlertItem({ alert, compact = false }) {
  const { id, documentName, person, daysRemaining, severity } = alert;

  return (
    <Link
      to={`/alerts#${id}`}
      className={[
        "group flex items-center gap-3 rounded-lg border transition-all duration-150 hover:shadow-soft",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-accent",
        compact ? "px-3 py-2.5" : "items-start px-4 py-3.5",
        severityStyles[severity] || severityStyles.info,
      ].join(" ")}
    >
      <div
        className={[
          "flex shrink-0 items-center justify-center rounded-md",
          severity === "warning" ? "bg-amber-100 text-vault-warning" : "bg-vault-accent-soft text-vault-accent",
          compact ? "h-8 w-8" : "mt-0.5 h-8 w-8 rounded-lg",
        ].join(" ")}
      >
        <Icon name="alerts" className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium leading-snug text-vault-text">
          {person}&apos;s {documentName}
        </p>
        <p className="mt-0.5 text-sm text-vault-muted">
          Expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
        </p>
      </div>

      <Icon
        name="chevronRight"
        className="h-4 w-4 shrink-0 text-vault-muted/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-vault-muted"
      />
    </Link>
  );
}
