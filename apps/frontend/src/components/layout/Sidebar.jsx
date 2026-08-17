import { NavLink } from "react-router-dom";
import { navItems } from "../../config/navigation";
import Icon from "../ui/Icon";
import { alerts } from "../../data/mockData";

function NavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors duration-150",
          isActive
            ? "bg-vault-accent-soft text-vault-accent"
            : "text-vault-muted hover:bg-vault-border-subtle hover:text-vault-text",
        ].join(" ")
      }
    >
      <Icon name={icon} className="h-[18px] w-[18px]" />
      <span>{label}</span>
      {icon === "alerts" && alerts.length > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-vault-accent px-1.5 text-[11px] font-semibold text-white">
          {alerts.length}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-vault-border lg:bg-vault-surface">
      <div className="flex h-16 items-center px-6">
        <NavLink to="/" className="flex items-center gap-2.5 focus-visible:outline-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-accent text-white">
            <Icon name="documents" className="h-4 w-4" />
          </div>
          <span className="font-serif text-xl tracking-tight text-vault-text">Doc Vault</span>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-t border-vault-border-subtle px-6 py-4">
        <p className="text-xs text-vault-muted">Your documents, organized.</p>
      </div>
    </aside>
  );
}
