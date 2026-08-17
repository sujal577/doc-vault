export function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getRecentDocuments(docs, limit = 5) {
  return [...docs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}
