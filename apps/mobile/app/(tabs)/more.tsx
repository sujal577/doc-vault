import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { clearTokens } from "@/lib/api";

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.item} onPress={() => router.push("/persons")}>
        <Text style={styles.itemText}>Manage Persons</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => router.push("/compare")}>
        <Text style={styles.itemText}>Compare Documents</Text>
      </Pressable>
      <Pressable
        style={[styles.item, styles.danger]}
        onPress={async () => {
          await clearTokens();
          router.replace("/login");
        }}
      >
        <Text style={styles.itemText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  item: { backgroundColor: "#1a2332", borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#2d3a4f" },
  itemText: { color: "#e8edf4", fontWeight: "500" },
  danger: { marginTop: 24 },
});
