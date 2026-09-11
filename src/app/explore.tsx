import ExploreEmoteTile from "@/components/ExploreEmoteTile";
import { fetchEmotes } from "@/lib/api";
import { useEmotes } from "@/lib/emotes-context";
import { Emote } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PAGE_SIZE = 60;

export default function ExploreScreen() {
  const { addEmote, emotes: savedEmotes, removeEmote } = useEmotes();
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    const currentRequestId = ++requestId.current;
    const normalizedQuery = query.trim();

    async function loadFirstPage() {
      setLoading(true);
      setLoadingMore(false);
      setError(null);
      setEmotes([]);
      setPage(1);
      setHasMore(true);

      try {
        const remoteEmotes = await fetchEmotes(normalizedQuery, 1, PAGE_SIZE);

        if (active && currentRequestId === requestId.current) {
          setEmotes(remoteEmotes);
          setHasMore(remoteEmotes.length === PAGE_SIZE);
        }
      } catch {
        if (active && currentRequestId === requestId.current) {
          setError("Unable to load emotes.");
        }
      } finally {
        if (active && currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(loadFirstPage, normalizedQuery ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  async function loadMore() {
    if (loading || loadingMore || !hasMore) return;

    const nextPage = page + 1;
    const currentRequestId = requestId.current;
    setLoadingMore(true);

    try {
      const nextEmotes = await fetchEmotes(query.trim(), nextPage, PAGE_SIZE);

      if (currentRequestId !== requestId.current) return;

      setEmotes((current) => {
        const existingIds = new Set(current.map((emote) => emote.id));
        return [
          ...current,
          ...nextEmotes.filter((emote) => !existingIds.has(emote.id)),
        ];
      });
      setPage(nextPage);
      setHasMore(nextEmotes.length === PAGE_SIZE);
    } catch {
      if (currentRequestId === requestId.current) {
        setError("Unable to load more emotes.");
      }
    } finally {
      if (currentRequestId === requestId.current) setLoadingMore(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={emotes}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.gridRow}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Explore emotes</Text>
            <Text style={styles.subtitle}>
              Find a reaction and save it to your vault.
            </Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search emotes"
              style={styles.search}
              autoCapitalize="none"
            />
            {loading && (
              <ActivityIndicator color="#6a5acd" style={styles.status} />
            )}
            {error && <Text style={styles.statusText}>{error}</Text>}
          </View>
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color="#6a5acd" /> : null
        }
        renderItem={({ item }) => {
          const isSaved = savedEmotes.some((saved) => saved.id === item.id);

          return (
            <ExploreEmoteTile
              emote={item}
              isSaved={isSaved}
              onPress={() => {
                if (isSaved) {
                  removeEmote(item.id);
                } else {
                  addEmote(item);
                }
              }}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No matching emotes.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7ff" },
  list: { padding: 16, paddingBottom: 32 },
  gridRow: { marginHorizontal: -5 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#556", marginBottom: 16 },
  search: {
    backgroundColor: "#fff",
    borderColor: "#d9e0f1",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  status: { marginVertical: 12 },
  statusText: { color: "#7a5b00", marginBottom: 8 },
  empty: { color: "#667", paddingVertical: 24, textAlign: "center" },
});
