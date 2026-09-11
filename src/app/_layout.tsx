import { EmotesProvider } from "@/lib/emotes-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <EmotesProvider>
      <Tabs screenOptions={{ headerTitle: "" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Collection",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="emote/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </EmotesProvider>
  );
}
