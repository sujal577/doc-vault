export default function SectionHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-semibold tracking-tight text-vault-text">{title}</h2>
      {action}
    </div>
  );
}
