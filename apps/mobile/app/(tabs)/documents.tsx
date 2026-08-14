import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  isFavorite: boolean;
  inTravelPack: boolean;
}

export default function DocumentsScreen() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    api<Doc[]>("/documents").then(setDocs);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/document/${item.id}`)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>
              {DOCUMENT_TYPE_LABELS[item.type]} · {item.personName}
            </Text>
            <View style={styles.flags}>
              {item.isFavorite && <Text style={styles.badge}>★</Text>}
              {item.inTravelPack && <Text style={[styles.badge, styles.travel]}>Travel</Text>}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No documents</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  card: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#2d3a4f" },
  title: { color: "#e8edf4", fontWeight: "600", fontSize: 16 },
  muted: { color: "#8b9cb3", marginTop: 4 },
  flags: { flexDirection: "row", marginTop: 8, gap: 8 },
  badge: { color: "#8b9cb3", fontSize: 12 },
  travel: { color: "#22c55e" },
});
