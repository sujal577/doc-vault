import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Result {
  id: string;
  title: string;
  type: DocumentType;
  personName: string;
}

export default function SearchScreen() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  async function search() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    setResults(await api<Result[]>(`/search?${params}`));
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={q} onChangeText={setQ} placeholder="Search documents…" placeholderTextColor="#8b9cb3" />
      <Pressable style={styles.btn} onPress={search}>
        <Text style={styles.btnText}>Search</Text>
      </Pressable>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>
              {DOCUMENT_TYPE_LABELS[item.type]} · {item.personName}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  input: { backgroundColor: "#243044", borderRadius: 8, padding: 12, color: "#e8edf4", marginBottom: 12, borderWidth: 1, borderColor: "#2d3a4f" },
  btn: { backgroundColor: "#3b82f6", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 16 },
  btnText: { color: "#fff", fontWeight: "600" },
  card: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#2d3a4f" },
  title: { color: "#e8edf4", fontWeight: "600" },
  muted: { color: "#8b9cb3", marginTop: 4 },
});
