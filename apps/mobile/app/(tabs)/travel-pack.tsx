import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
}

export default function TravelPackScreen() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    api<Doc[]>("/documents?travelPack=true").then(setDocs);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Documents marked for travel</Text>
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>
              {DOCUMENT_TYPE_LABELS[item.type]} · {item.personName}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No travel pack documents</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  subtitle: { color: "#8b9cb3", marginBottom: 16 },
  card: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#2d3a4f" },
  title: { color: "#e8edf4", fontWeight: "600" },
  muted: { color: "#8b9cb3", marginTop: 4 },
});
