import Icon from "./Icon";

const variants = {
  primary:
    "bg-vault-accent text-white hover:bg-vault-accent-hover shadow-soft",
  secondary:
    "bg-vault-surface text-vault-text border border-vault-border hover:border-vault-muted/40 hover:bg-vault-bg",
  ghost: "text-vault-muted hover:text-vault-text hover:bg-vault-border-subtle",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vault-accent",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {icon && iconPosition === "left" && <Icon name={icon} className="h-4 w-4" />}
      {children}
      {icon && iconPosition === "right" && <Icon name={icon} className="h-4 w-4" />}
    </button>
  );
}
