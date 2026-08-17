export default function PageHeader({ title, description, children }) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-vault-text sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-vault-muted">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}
