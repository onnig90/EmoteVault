import { useEmotes } from "@/lib/emotes-context";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EmoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { emotes, removeEmote, updateEmote } = useEmotes();

  const emote = emotes.find((item) => item.id === id);
  const previewSource = emote?.highQualitySource ?? emote?.source;
  const [trigger, setTrigger] = useState(emote?.trigger ?? "");
  const [tagsInput, setTagsInput] = useState(emote?.tags.join(", ") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(
    Boolean(emote?.highQualitySource ?? emote?.source),
  );

  useEffect(() => {
    if (emote) {
      setTrigger(emote.trigger);
      setTagsInput(emote.tags.join(", "));
    }
  }, [emote]);

  useEffect(() => {
    setPreviewLoading(Boolean(previewSource));
  }, [previewSource]);

  if (!emote) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Emote not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    const nextTrigger = trigger.trim();
    const nextTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!nextTrigger) {
      setError("Trigger text is required.");
      return;
    }

    if (nextTags.length === 0) {
      setError("Please add at least one tag.");
      return;
    }

    updateEmote(emote.id, {
      trigger: nextTrigger,
      tags: nextTags,
    });

    setError(null);
  };

  const handleDelete = () => {
    removeEmote(emote.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{emote.name}</Text>
      <View style={styles.previewContainer}>
        {previewSource ? (
          <View style={styles.previewFrame}>
            <Image
              source={{ uri: previewSource }}
              style={[styles.preview, previewLoading && styles.previewHidden]}
              contentFit="contain"
              allowDownscaling={false}
              onLoadStart={() => setPreviewLoading(true)}
              onLoadEnd={() => setPreviewLoading(false)}
            />
            {previewLoading && (
              <ActivityIndicator
                color="#6a5acd"
                size="large"
                style={styles.previewLoader}
              />
            )}
          </View>
        ) : (
          <Text style={styles.emojiPreview}>{emote.emoji ?? "?"}</Text>
        )}
      </View>
      <Text style={styles.label}>Trigger</Text>
      <TextInput
        value={trigger}
        onChangeText={setTrigger}
        placeholder="Type your trigger text"
        style={styles.input}
      />

      <Text style={styles.label}>Tags</Text>
      <TextInput
        value={tagsInput}
        onChangeText={setTagsInput}
        placeholder="tag1, tag2, tag3, ..."
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Save Changes" onPress={handleSave} />
      <View style={styles.spacer} />
      <Button
        title="Remove from Collection"
        color="#b42318"
        onPress={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7ff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 18,
  },
  previewContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    height: 180,
    justifyContent: "center",
    marginBottom: 8,
    padding: 16,
  },
  preview: {
    height: "100%",
    width: "100%",
  },
  previewFrame: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
  previewHidden: {
    opacity: 0,
  },
  previewLoader: {
    ...StyleSheet.absoluteFill,
  },
  emojiPreview: {
    fontSize: 88,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5b6475",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9e0f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  error: {
    color: "#b42318",
    marginVertical: 8,
  },
  spacer: {
    height: 12,
  },
  notFound: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 32,
  },
});
