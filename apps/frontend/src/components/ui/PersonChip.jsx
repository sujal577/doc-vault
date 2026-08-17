import { Link } from "react-router-dom";

export default function PersonChip({ person }) {
  const displayName = person.label ? `${person.name} (${person.label})` : person.name;
  const initial = person.name.charAt(0).toUpperCase();

  return (
    <Link
      to={`/people?person=${person.id}`}
      className="group flex items-center gap-3 rounded-xl border border-vault-border-subtle bg-vault-surface px-4 py-3 transition-all duration-150 hover:border-vault-border hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-accent"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vault-accent-soft text-sm font-semibold text-vault-accent">
        {initial}
      </div>
      <span className="text-[15px] font-medium text-vault-text group-hover:text-vault-accent">
        {displayName}
      </span>
    </Link>
  );
}
