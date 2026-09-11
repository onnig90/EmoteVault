import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Emote } from "@/lib/types";

type ExploreEmoteTileProps = {
  emote: Emote;
  isSaved: boolean;
  onPress: () => void;
};

export default function ExploreEmoteTile({
  emote,
  isSaved,
  onPress,
}: ExploreEmoteTileProps) {
  const imageSource = emote.highQualitySource ?? emote.source;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${isSaved ? "Remove" : "Save"} ${emote.name}`}
      accessibilityState={{ checked: isSaved }}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.imageFrame}>
        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        ) : (
          <Ionicons name="image-outline" size={32} color="#a4a9b8" />
        )}
        {isSaved && (
          <View style={styles.savedOverlay}>
            <Ionicons name="checkmark-circle" size={34} color="#fff" />
          </View>
        )}
      </View>
      <Text
        style={[styles.name, isSaved && styles.savedName]}
        numberOfLines={1}
      >
        {emote.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  imageFrame: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderColor: "#e1e4ec",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    height: "78%",
    width: "78%",
  },
  savedOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(55, 61, 72, 0.62)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  name: {
    color: "#202633",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 7,
    textAlign: "center",
  },
  savedName: {
    color: "#7d8492",
  },
});
