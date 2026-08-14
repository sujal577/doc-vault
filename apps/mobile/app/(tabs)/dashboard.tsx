import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DashboardStats } from "@doc-vault/shared";

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setStats(await api<DashboardStats>("/dashboard"));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor="#3b82f6" />}
    >
      {stats && (
        <>
          <View style={styles.row}>
            <StatCard label="Documents" value={stats.totalDocuments} />
            <StatCard label="Persons" value={stats.totalPersons} />
          </View>
          <View style={styles.row}>
            <StatCard label="Favorites" value={stats.favoritesCount} />
            <StatCard label="Travel Pack" value={stats.travelPackCount} />
          </View>
          <Section title="Expiring soon">
            {stats.expiringSoon.length === 0 ? (
              <Text style={styles.muted}>None</Text>
            ) : (
              stats.expiringSoon.map((d) => (
                <Text key={d.id} style={styles.item}>
                  {d.title} — {d.personName}
                </Text>
              ))
            )}
          </Section>
          <Section title="Missing documents">
            {stats.missingByPerson.map((m) => (
              <View key={m.personId} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{m.personName}</Text>
                <Text style={styles.muted}>{m.missingTypes.map((t) => DOCUMENT_TYPE_LABELS[t]).join(", ")}</Text>
              </View>
            ))}
          </Section>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.stat}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: { flex: 1, backgroundColor: "#1a2332", borderRadius: 10, padding: 16, borderWidth: 1, borderColor: "#2d3a4f" },
  stat: { fontSize: 28, fontWeight: "700", color: "#e8edf4" },
  muted: { color: "#8b9cb3", fontSize: 13 },
  section: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d3a4f" },
  sectionTitle: { fontWeight: "600", color: "#e8edf4", marginBottom: 8 },
  item: { color: "#e8edf4", marginBottom: 4 },
  itemTitle: { color: "#e8edf4", fontWeight: "600" },
});
