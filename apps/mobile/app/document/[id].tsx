import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { api, API_URL, getToken } from "@/lib/api";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@doc-vault/shared";

interface Doc {
  id: string;
  title: string;
  type: DocumentType;
  personName?: string;
  metadata: Record<string, unknown>;
  isFavorite: boolean;
  inTravelPack: boolean;
  versions: { year: number; fileName: string }[];
}

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);

  async function load() {
    setDoc(await api<Doc>(`/documents/${id}`));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function uploadFile() {
    const result = await DocumentPicker.getDocumentAsync({ type: ["image/*", "application/pdf"], copyToCacheDirectory: true });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const form = new FormData();
    form.append("file", { uri: asset.uri, name: asset.name, type: asset.mimeType ?? "application/octet-stream" } as unknown as Blob);
    form.append("year", String(new Date().getFullYear()));

    const token = await getToken();
    const res = await fetch(`${API_URL}/documents/${id}/versions`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      Alert.alert("Upload failed");
      return;
    }
    Alert.alert("Uploaded", "OCR processed on upload");
    load();
  }

  if (!doc) return <View style={styles.container}><Text style={styles.muted}>Loading…</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{doc.title}</Text>
      <Text style={styles.muted}>{DOCUMENT_TYPE_LABELS[doc.type]} · {doc.personName}</Text>
      <Pressable style={styles.btn} onPress={uploadFile}>
        <Text style={styles.btnText}>Upload version (OCR)</Text>
      </Pressable>
      <Text style={styles.sectionTitle}>Versions</Text>
      {doc.versions.map((v) => (
        <Text key={v.year} style={styles.item}>{v.year} — {v.fileName}</Text>
      ))}
      <Text style={styles.sectionTitle}>Metadata</Text>
      <Text style={styles.mono}>{JSON.stringify(doc.metadata, null, 2)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#e8edf4" },
  muted: { color: "#8b9cb3", marginBottom: 16 },
  btn: { backgroundColor: "#3b82f6", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 16 },
  btnText: { color: "#fff", fontWeight: "600" },
  sectionTitle: { color: "#e8edf4", fontWeight: "600", marginTop: 12, marginBottom: 8 },
  item: { color: "#e8edf4", marginBottom: 4 },
  mono: { color: "#8b9cb3", fontFamily: "monospace", fontSize: 12 },
});
