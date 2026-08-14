import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Person {
  id: string;
  name: string;
  relation: string | null;
  documentCount: number;
}

export default function PersonsScreen() {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    api<Person[]>("/persons").then(setPersons);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={persons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.muted}>{item.relation ?? "—"} · {item.documentCount} docs</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  card: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#2d3a4f" },
  title: { color: "#e8edf4", fontWeight: "600" },
  muted: { color: "#8b9cb3", marginTop: 4 },
});
