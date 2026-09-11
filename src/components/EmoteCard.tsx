import { Emote } from "@/lib/types";
import { Image } from "expo-image";
import {
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
} from "react-native";

type EmoteCardProps = Emote & PressableProps;

export default function EmoteCard({
  id,
  name,
  trigger,
  tags,
  source,
  ...props
}: EmoteCardProps) {
  return (
    <Pressable {...props}>
      <View style={styles.card} key={id}>
        <View style={styles.contentRow}>
          {source && (
            <Image
              source={{ uri: source }}
              style={styles.preview}
              contentFit="contain"
            />
          )}
          <View style={styles.headerRow}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.trigger}>{trigger}</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {tags.slice(0, 3).map((tag) => (
            <Text key={`${id}-${tag}`} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  contentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  preview: {
    height: 42,
    width: 42,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  trigger: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6a5acd",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tag: {
    fontSize: 11,
    color: "#556",
    backgroundColor: "#f0f2ff",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
