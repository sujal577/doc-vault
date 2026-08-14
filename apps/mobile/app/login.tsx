import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { api, setTokens } from "@/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("demo@docvault.local");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      const data = await api<{ accessToken: string; refreshToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await setTokens(data.accessToken, data.refreshToken);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      Alert.alert("Login failed", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doc Vault</Text>
      <Text style={styles.subtitle}>Encrypted personal document vault</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" placeholderTextColor="#8b9cb3" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#8b9cb3" />
      <Pressable style={styles.btn} onPress={login} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Signing in…" : "Sign in"}</Text>
      </Pressable>
      <Text style={styles.hint}>Demo: demo@docvault.local / demo1234</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", color: "#e8edf4", marginBottom: 8 },
  subtitle: { color: "#8b9cb3", marginBottom: 24 },
  input: { backgroundColor: "#243044", borderRadius: 8, padding: 12, color: "#e8edf4", marginBottom: 12, borderWidth: 1, borderColor: "#2d3a4f" },
  btn: { backgroundColor: "#3b82f6", borderRadius: 8, padding: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  hint: { color: "#8b9cb3", marginTop: 16, fontSize: 13 },
});
