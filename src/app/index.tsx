import EmoteCard from "@/components/EmoteCard";
import { useEmotes } from "@/lib/emotes-context";
import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function CollectionScreen() {
  const { emotes } = useEmotes();

  return (
    <View style={styles.content}>
      <FlatList
        data={emotes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.appName}>Emote Vault</Text>
            <Text style={styles.tagline}>Your saved emotes</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/emote/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <EmoteCard {...item} />
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No saved emotes yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f7ff",
  },
  headerBlock: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#556",
  },
  empty: {
    textAlign: "center",
    color: "#667",
    paddingVertical: 24,
  },
});
