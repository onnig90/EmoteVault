import { useEmotes } from "@/lib/emotes-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateEmoteScreen() {
  const router = useRouter();
  const { addEmote } = useEmotes();
  const [imageUrl, setImageUrl] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    const nextUrl = imageUrl.trim();
    const nextCode = code.trim().replace(/^:+|:+$/g, "");
    const nextTags = category
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!/^https?:\/\/\S+$/i.test(nextUrl)) {
      setError("Enter a valid image URL.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]{2,32}$/.test(nextCode)) {
      setError("Use 2-32 letters, numbers, dashes, or underscores.");
      return;
    }

    if (nextTags.length === 0) {
      setError("Add a category tag.");
      return;
    }

    addEmote({
      id: `custom-${Date.now()}`,
      name: nextCode,
      trigger: `:${nextCode}:`,
      tags: nextTags,
      source: nextUrl,
    });
    setError(null);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create emote</Text>
      <Text style={styles.subtitle}>
        Add a custom emote to your collection.
      </Text>

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://example.com/emote.png"
        autoCapitalize="none"
        keyboardType="url"
        style={styles.input}
      />

      <Text style={styles.label}>Emote code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="emotecode"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Category tags</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="tag1, tag2, tag3, ..."
        autoCapitalize="none"
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Add to Collection" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#556",
    marginBottom: 18,
  },
  label: {
    color: "#5b6475",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d9e0f1",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: "#b42318",
    marginBottom: 10,
    marginTop: 4,
  },
});
