import PageHeader from "../components/ui/PageHeader";
import { USER } from "../data/mockData";

const settingsSections = [
  {
    title: "Profile",
    items: [{ label: "Display name", value: USER.name }],
  },
  {
    title: "Preferences",
    items: [
      { label: "Expiry reminders", value: "30, 7, and 1 day before" },
      { label: "Theme", value: "Light" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Encryption", value: "Enabled" },
      { label: "Authentication", value: "Coming soon" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your vault preferences."
      />

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-vault-muted">
              {section.title}
            </h2>
            <div className="overflow-hidden rounded-xl border border-vault-border bg-vault-surface shadow-soft">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={[
                    "flex items-center justify-between gap-4 px-4 py-3.5",
                    index < section.items.length - 1 ? "border-b border-vault-border-subtle" : "",
                  ].join(" ")}
                >
                  <span className="text-[15px] text-vault-text">{item.label}</span>
                  <span className="text-sm text-vault-muted">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
