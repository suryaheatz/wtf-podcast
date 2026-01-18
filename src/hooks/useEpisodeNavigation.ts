import { useEffect, useState } from "react";
import { PodcastService } from "../services/podcast.service";

export function useEpisodeNavigation(currentEpisodeId: string | null) {
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [loadingNav, setLoadingNav] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!currentEpisodeId) return;

      setLoadingNav(true);
      try {
        const episodes = await PodcastService.getEpisodesForNavigation({
          includeUnpublished: true,
        });

        const isNumeric = /^\d+$/.test(currentEpisodeId);
        const currentNumber = isNumeric ? Number(currentEpisodeId) : null;
        const index = episodes.findIndex((e) =>
          isNumeric ? e.episode_number === currentNumber : e.id === currentEpisodeId
        );

        const prev = index > 0 ? episodes[index - 1] ?? null : null;
        const next =
          index >= 0 && index < episodes.length - 1
            ? episodes[index + 1] ?? null
            : null;

        if (!isMounted) return;
        setPrevId(prev ? String(prev.episode_number ?? prev.id) : null);
        setNextId(next ? String(next.episode_number ?? next.id) : null);
      } catch (e) {
        // if anything fails, don't crash the page; just disable nav
        if (!isMounted) return;
        setPrevId(null);
        setNextId(null);
      } finally {
        if (isMounted) setLoadingNav(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [currentEpisodeId]);

  return { prevId, nextId, loadingNav };
}
