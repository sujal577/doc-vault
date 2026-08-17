import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { mobileNavItems, mobileMoreItems } from "../../config/navigation";
import Icon from "../ui/Icon";
import { alerts } from "../../data/mockData";

function BottomNavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors duration-150",
          isActive
            ? "bg-vault-accent-soft text-vault-accent"
            : "text-vault-muted active:bg-vault-border-subtle",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={icon} className={isActive ? "h-5 w-5" : "h-5 w-5"} />
          <span className={isActive ? "font-semibold" : ""}>{label}</span>
          {icon === "alerts" && alerts.length > 0 && (
            <span className="absolute right-[calc(50%-22px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vault-accent px-1 text-[10px] font-bold leading-none text-white">
              {alerts.length}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isMoreActive = mobileMoreItems.some((item) => location.pathname.startsWith(item.to));

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-vault-border bg-vault-surface/95 px-4 backdrop-blur-sm lg:hidden">
        <NavLink to="/" className="flex items-center gap-2 focus-visible:outline-none">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-vault-accent text-white">
            <Icon name="documents" className="h-3.5 w-3.5" />
          </div>
          <span className="font-serif text-lg tracking-tight">Doc Vault</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
            isMoreActive
              ? "bg-vault-accent-soft text-vault-accent"
              : "text-vault-muted hover:bg-vault-border-subtle hover:text-vault-text",
          ].join(" ")}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Icon name="menu" />
        </button>
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-vault-border bg-vault-surface/95 px-1.5 pt-1 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch gap-0.5">
          {mobileNavItems.map((item) => (
            <BottomNavItem key={item.to} {...item} />
          ))}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={[
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors duration-150",
              isMoreActive || menuOpen
                ? "bg-vault-accent-soft text-vault-accent"
                : "text-vault-muted active:bg-vault-border-subtle",
            ].join(" ")}
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            <span className="flex h-5 w-5 items-center justify-center text-base leading-none">···</span>
            <span className={isMoreActive || menuOpen ? "font-semibold" : ""}>More</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-vault-text/20 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-vault-border bg-vault-surface p-4 shadow-card"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-vault-text">More</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-vault-muted transition-colors hover:bg-vault-border-subtle"
                aria-label="Close menu"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {mobileMoreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors",
                      isActive
                        ? "bg-vault-accent-soft text-vault-accent"
                        : "text-vault-text hover:bg-vault-border-subtle active:bg-vault-border-subtle",
                    ].join(" ")
                  }
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
