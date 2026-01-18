import { useState, useEffect } from 'react';
import { PodcastService } from '../services/podcast.service';
import type { Database, InsightType, GuestWithTag, EpisodeInsight, EpisodeWithDetails } from '../types/database';

type Podcast = Database['public']['Tables']['podcasts']['Row'];
type Episode = Database['public']['Tables']['episodes']['Row'];
type Quote = Database['public']['Tables']['quotes']['Row'];

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseDataArrayResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePodcasts(): UseDataArrayResult<Podcast> {
  const [data, setData] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const podcasts = await PodcastService.getPodcasts();
      setData(podcasts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export function usePodcast(slug: string | null): UseDataResult<Podcast> {
  const [data, setData] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const podcast = await PodcastService.getPodcastBySlug(slug);
      setData(podcast);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  return { data, loading, error, refetch: fetchData };
}

export function useEpisodes(podcastId?: string): UseDataArrayResult<Episode> {
  const [data, setData] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const episodes = await PodcastService.getEpisodes(podcastId);
      setData(episodes);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [podcastId]);

  return { data, loading, error, refetch: fetchData };
}

export function useEpisode(id: string | null): UseDataResult<Episode> {
  const [data, setData] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const isNumeric = /^\d+$/.test(id);
      const episode = isNumeric
        ? await PodcastService.getEpisodeByNumber(Number(id))
        : await PodcastService.getEpisodeById(id);
      setData(episode);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, error, refetch: fetchData };
}

export function useQuotes(episodeId?: string, podcastId?: string): UseDataArrayResult<Quote> {
  const [data, setData] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let quotes: Quote[] = [];
      if (episodeId) {
        quotes = await PodcastService.getQuotesByEpisode(episodeId);
      } else if (podcastId) {
        quotes = await PodcastService.getQuotesByPodcast(podcastId);
      }

      setData(quotes);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [episodeId, podcastId]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch episode with all related data (guests and insights)
 */
export function useEpisodeWithDetails(episodeId: string | null): UseDataResult<EpisodeWithDetails> {
  const [data, setData] = useState<EpisodeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!episodeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const isNumeric = /^\d+$/.test(episodeId);
      const episode = isNumeric
        ? await PodcastService.getEpisodeWithDetailsByNumber(Number(episodeId))
        : await PodcastService.getEpisodeWithDetails(episodeId);
      setData(episode);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [episodeId]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch insights by type for an episode
 */
export function useInsightsByType(episodeId: string | null, type: InsightType | null): UseDataArrayResult<EpisodeInsight> {
  const [data, setData] = useState<EpisodeInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!episodeId || !type) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const insights = await PodcastService.getInsightsByType(episodeId, type);
      setData(insights);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [episodeId, type]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch guests for an episode
 */
export function useEpisodeGuests(episodeId: string | null): UseDataArrayResult<GuestWithTag> {
  const [data, setData] = useState<GuestWithTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!episodeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const guests = await PodcastService.getEpisodeGuests(episodeId);
      setData(guests);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [episodeId]);

  return { data, loading, error, refetch: fetchData };
}
