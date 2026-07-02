/** Extract a YouTube video id from common watch/embed URLs. */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }

    if (parsed.pathname.includes("/embed/")) {
      const id = parsed.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0];
      return id || null;
    }

    const watchId = parsed.searchParams.get("v");
    if (watchId) return watchId;
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnail(embedOrWatchUrl: string): string | null {
  const id = extractYouTubeVideoId(embedOrWatchUrl);
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function buildYouTubeEmbedUrl(embedOrWatchUrl: string, autoplay = false): string {
  const id = extractYouTubeVideoId(embedOrWatchUrl);
  if (!id) return embedOrWatchUrl;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getVideoThumbnail(embedUrl: string, thumbnail?: string): string | undefined {
  return thumbnail || getYouTubeThumbnail(embedUrl) || undefined;
}
