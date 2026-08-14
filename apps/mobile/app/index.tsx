import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/lib/api";

export default function Index() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  if (token === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f1419" }}>
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  return <Redirect href={token ? "/(tabs)/dashboard" : "/login"} />;
}
