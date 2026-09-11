import AsyncStorage from "@react-native-async-storage/async-storage";

import { Emote } from "./types";

export const STORAGE_KEY = "emotevault.savedEmotes";

export async function saveEmotes(emotes: Emote[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(emotes));
}

export async function loadEmotes(): Promise<Emote[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as Emote[]) : [];
}
