import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { loadEmotes, saveEmotes } from "./storage";
import { Emote } from "./types";

type EmotesValue = {
  emotes: Emote[];
  addEmote: (emote: Emote) => void;
  updateEmote: (id: string, updates: Partial<Omit<Emote, "id">>) => void;
  removeEmote: (id: string) => void;
};

const EmotesContext = createContext<EmotesValue | null>(null);

export function EmotesProvider({ children }: { children: ReactNode }) {
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const saved = await loadEmotes();
      if (active) {
        setEmotes(saved);
        setReady(true);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      saveEmotes(emotes);
    }
  }, [emotes, ready]);

  const addEmote = (emote: Emote) => {
    setEmotes((current) => {
      if (current.some((item) => item.id === emote.id)) {
        return current;
      }

      return [...current, emote];
    });
  };

  const updateEmote = (id: string, updates: Partial<Omit<Emote, "id">>) => {
    setEmotes((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              tags: updates.tags ?? item.tags,
            }
          : item,
      ),
    );
  };

  const removeEmote = (id: string) => {
    setEmotes((current) => current.filter((item) => item.id !== id));
  };

  return (
    <EmotesContext.Provider
      value={{ emotes, addEmote, updateEmote, removeEmote }}
    >
      {children}
    </EmotesContext.Provider>
  );
}

export function useEmotes() {
  const value = useContext(EmotesContext);

  if (!value) {
    throw new Error("useEmotes must be used inside an EmotesProvider");
  }

  return value;
}
