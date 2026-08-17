import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function SearchInput({
  placeholder = "Search your Vault...",
  className = "",
  autoFocus = false,
  onFocus,
}) {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <label htmlFor="global-search" className="sr-only">
        Search your vault
      </label>
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-vault-muted"
        />
        <input
          id="global-search"
          name="search"
          type="search"
          autoFocus={autoFocus}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full rounded-xl border border-vault-border bg-vault-surface py-3 pl-10 pr-4 text-[15px] text-vault-text shadow-soft placeholder:text-vault-muted/70 transition-colors duration-150 hover:border-vault-muted/30 focus:border-vault-accent focus:outline-none focus:ring-2 focus:ring-vault-accent/20"
        />
      </div>
    </form>
  );
}
