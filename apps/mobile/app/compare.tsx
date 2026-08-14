import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  metadata: Record<string, unknown>;
  versions: { year: number; fileName: string }[];
}

export default function CompareScreen() {
  const [allDocs, setAllDocs] = useState<Doc[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [compared, setCompared] = useState<Doc[]>([]);

  useEffect(() => {
    api<Doc[]>("/documents").then(setAllDocs);
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  async function compare() {
    if (selected.length < 2) return;
    setCompared(await api<Doc[]>(`/documents/compare?ids=${selected.join(",")}`));
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>Select 2 documents to compare</Text>
      {allDocs.map((d) => (
        <Pressable key={d.id} style={[styles.row, selected.includes(d.id) && styles.selected]} onPress={() => toggle(d.id)}>
          <Text style={styles.rowText}>{d.title}</Text>
        </Pressable>
      ))}
      <Pressable style={[styles.btn, selected.length < 2 && styles.disabled]} onPress={compare} disabled={selected.length < 2}>
        <Text style={styles.btnText}>Compare</Text>
      </Pressable>
      {compared.map((d) => (
        <View key={d.id} style={styles.card}>
          <Text style={styles.title}>{d.title}</Text>
          <Text style={styles.muted}>{DOCUMENT_TYPE_LABELS[d.type]}</Text>
          <Text style={styles.mono}>{JSON.stringify(d.metadata, null, 2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  subtitle: { color: "#8b9cb3", marginBottom: 16 },
  row: { padding: 12, backgroundColor: "#1a2332", borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: "#2d3a4f" },
  selected: { borderColor: "#3b82f6" },
  rowText: { color: "#e8edf4" },
  btn: { backgroundColor: "#3b82f6", borderRadius: 8, padding: 12, alignItems: "center", marginVertical: 16 },
  disabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "600" },
  card: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d3a4f" },
  title: { color: "#e8edf4", fontWeight: "600" },
  muted: { color: "#8b9cb3", marginBottom: 8 },
  mono: { color: "#8b9cb3", fontSize: 11, fontFamily: "monospace" },
});
