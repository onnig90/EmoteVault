import { Emote } from "./types";

type SevenTvFile = {
  name: string;
  width: number;
  height: number;
  format: string;
};

type SevenTvEmote = {
  id: string;
  name: string;
  animated: boolean;
  tags: string[];
  host: {
    url: string;
    files: SevenTvFile[];
  };
};

type SevenTvResponse = {
  data?: {
    emotes?: {
      items: SevenTvEmote[];
    };
  };
  errors?: { message: string }[];
};

const SEVEN_TV_QUERY = `
  query SearchEmotes($query: String!, $page: Int!, $limit: Int!) {
    emotes(query: $query, page: $page, limit: $limit) {
      items {
        id
        name
        animated
        tags
        host {
          url
          files { name width height format }
        }
      }
    }
  }
`;

export async function fetchEmotes(
  query = "",
  page = 1,
  limit = 40,
): Promise<Emote[]> {
  const response = await fetch("https://7tv.io/v3/gql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SEVEN_TV_QUERY,
      variables: { query, page, limit },
    }),
  });

  if (!response.ok) {
    throw new Error(`7TV request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as SevenTvResponse;
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  return (payload.data?.emotes?.items ?? []).map((emote) => {
    const preview =
      emote.host.files.find((file) => file.name === "1x.webp") ??
      emote.host.files[0];
    const highestQuality = emote.host.files.reduce<SevenTvFile | undefined>(
      (best, file) =>
        !best || file.width * file.height > best.width * best.height
          ? file
          : best,
      undefined,
    );
    const baseUrl = emote.host.url.startsWith("//")
      ? `https:${emote.host.url}`
      : emote.host.url;

    return {
      id: `7tv-${emote.id}`,
      name: emote.name,
      trigger: `:${emote.name}:`,
      tags: emote.tags.length > 0 ? emote.tags : ["7tv", "emote"],
      source: preview ? `${baseUrl}/${preview.name}` : undefined,
      highQualitySource: highestQuality
        ? `${baseUrl}/${highestQuality.name}`
        : undefined,
    };
  });
}
