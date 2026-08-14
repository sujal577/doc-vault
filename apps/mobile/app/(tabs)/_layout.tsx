import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1a2332", borderTopColor: "#2d3a4f" },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#8b9cb3",
        headerStyle: { backgroundColor: "#1a2332" },
        headerTintColor: "#e8edf4",
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="documents" options={{ title: "Documents" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="travel-pack" options={{ title: "Travel" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
