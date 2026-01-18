import { supabase } from '../lib/supabase';
import type { Database, InsightType, GuestWithTag, EpisodeInsight, EpisodeWithDetails } from '../types/database';

type Podcast = Database['public']['Tables']['podcasts']['Row'];
type Episode = Database['public']['Tables']['episodes']['Row'];
type Quote = Database['public']['Tables']['quotes']['Row'];
type Guest = Database['public']['Tables']['guests']['Row'];
type EpisodeGuest = Database['public']['Tables']['episode_guests']['Row'];

export interface EpisodeWithPodcast extends Episode {
  podcast_name?: string;
  podcast_slug?: string;
  podcast_cover?: string;
}

export class PodcastService {
  static async getPodcasts() {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Podcast[];
  }

  static async getPodcastBySlug(slug: string) {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data as Podcast | null;
  }

  static async getEpisodes(podcastId?: string) {
    let query = supabase
      .from('episodes')
      .select('*')
      .eq('is_published', true)
      .order('release_date', { ascending: false });

    if (podcastId) {
      query = query.eq('podcast_id', podcastId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Episode[];
  }

  //Added by @unmeelya for episode navigation

  static async getEpisodesForNavigation(options?: {
    podcastId?: string;
    includeUnpublished?: boolean;
  }) {
    const includeUnpublished = options?.includeUnpublished ?? true;

    let query = supabase
      .from("episodes")
      .select("id, episode_number, created_at, is_published")
      .order("episode_number", { ascending: true });

    if (!includeUnpublished) {
      query = query.eq("is_published", true);
    }

    if (options?.podcastId) {
      query = query.eq("podcast_id", options.podcastId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []) as {
      id: string;
      episode_number: number;
      created_at: string;
      is_published: boolean;
    }[];
  }



  static async getEpisodeById(id: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Episode | null;
  }

  static async getEpisodeByNumber(episodeNumber: number) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('episode_number', episodeNumber)
      .maybeSingle();

    if (error) throw error;
    return data as Episode | null;
  }

  static async getLatestEpisodes(limit: number = 10) {
    const { data, error } = await supabase
      .from('latest_episodes')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data as EpisodeWithPodcast[];
  }

  static async getQuotesByEpisode(episodeId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('episode_id', episodeId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Quote[];
  }

  static async getQuotesByPodcast(podcastId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('podcast_id', podcastId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Quote[];
  }

  static async incrementViewCount(episodeId: string) {
    const { error } = await supabase
      .rpc('increment_view_count', { episode_id: episodeId });

    if (error) console.error('Error incrementing view count:', error);
  }

  static async createPodcast(podcast: Database['public']['Tables']['podcasts']['Insert']) {
    const { data, error } = await supabase
      .from('podcasts')
      .insert(podcast)
      .select()
      .single();

    if (error) throw error;
    return data as Podcast;
  }

  static async createEpisode(episode: Database['public']['Tables']['episodes']['Insert']) {
    const { data, error } = await supabase
      .from('episodes')
      .insert(episode)
      .select()
      .single();

    if (error) throw error;
    return data as Episode;
  }

  static async createQuote(quote: Database['public']['Tables']['quotes']['Insert']) {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();

    if (error) throw error;
    return data as Quote;
  }

  // =====================================================
  // NEW METHODS FOR EXTENDED SCHEMA
  // =====================================================

  /**
   * Get episode with all related data (guests and insights)
   * Uses the episode_full_details view for optimized fetching
   */
  static async getEpisodeWithDetailsById(episodeId: string): Promise<EpisodeWithDetails | null> {
    // First get basic episode data
    const { data: episode, error: episodeError } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', episodeId)
      .maybeSingle();

    if (episodeError) throw episodeError;
    if (!episode) return null;

    // Get guests with tags
    const { data: guestsData, error: guestsError } = await supabase
      .from('episode_guests')
      .select(`
        guest_tag,
        display_order,
        guests (
          id,
          name,
          avatar_url,
          bio
        )
      `)
      .eq('episode_id', episodeId)
      .order('display_order', { ascending: true });

    if (guestsError) throw guestsError;

    // Transform guests data
    const guests: GuestWithTag[] = (guestsData || []).map((eg: any) => ({
      id: eg.guests.id,
      name: eg.guests.name,
      avatar_url: eg.guests.avatar_url,
      bio: eg.guests.bio,
      guest_tag: eg.guest_tag,
      display_order: eg.display_order
    }));

    // Get insights
    const { data: insights, error: insightsError } = await supabase
      .from('episode_insights')
      .select('*')
      .eq('episode_id', episodeId)
      .order('display_order', { ascending: true });

    if (insightsError) throw insightsError;

    return {
      ...episode,
      guests,
      insights: insights as EpisodeInsight[]
    };
  }

  static async getEpisodeWithDetails(episodeId: string): Promise<EpisodeWithDetails | null> {
    return this.getEpisodeWithDetailsById(episodeId);
  }

  static async getEpisodeWithDetailsByNumber(episodeNumber: number): Promise<EpisodeWithDetails | null> {
    const { data: episode, error } = await supabase
      .from('episodes')
      .select('id')
      .eq('episode_number', episodeNumber)
      .maybeSingle();

    if (error) throw error;
    if (!episode) return null;

    return this.getEpisodeWithDetailsById(episode.id);
  }

  /**
   * Get insights by episode and type
   */
  static async getInsightsByType(episodeId: string, type: InsightType): Promise<EpisodeInsight[]> {
    const { data, error } = await supabase
      .from('episode_insights')
      .select('*')
      .eq('episode_id', episodeId)
      .eq('type', type)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data as EpisodeInsight[];
  }

  /**
   * Get all guests for an episode with their tags
   */
  static async getEpisodeGuests(episodeId: string): Promise<GuestWithTag[]> {
    const { data, error } = await supabase
      .from('episode_guests')
      .select(`
        guest_tag,
        display_order,
        guests (
          id,
          name,
          avatar_url,
          bio
        )
      `)
      .eq('episode_id', episodeId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map((eg: any) => ({
      id: eg.guests.id,
      name: eg.guests.name,
      avatar_url: eg.guests.avatar_url,
      bio: eg.guests.bio,
      guest_tag: eg.guest_tag,
      display_order: eg.display_order
    }));
  }

  /**
   * Create a new guest
   */
  static async createGuest(guest: Database['public']['Tables']['guests']['Insert']): Promise<Guest> {
    const { data, error } = await supabase
      .from('guests')
      .insert(guest)
      .select()
      .single();

    if (error) throw error;
    return data as Guest;
  }

  /**
   * Link a guest to an episode
   */
  static async linkGuestToEpisode(
    episodeId: string,
    guestId: string,
    guestTag?: string,
    displayOrder: number = 0
  ): Promise<EpisodeGuest> {
    const { data, error } = await supabase
      .from('episode_guests')
      .insert({
        episode_id: episodeId,
        guest_id: guestId,
        guest_tag: guestTag,
        display_order: displayOrder
      })
      .select()
      .single();

    if (error) throw error;
    return data as EpisodeGuest;
  }

  /**
   * Create an episode insight
   */
  static async createInsight(
    insight: Database['public']['Tables']['episode_insights']['Insert']
  ): Promise<EpisodeInsight> {
    const { data, error } = await supabase
      .from('episode_insights')
      .insert(insight)
      .select()
      .single();

    if (error) throw error;
    return data as EpisodeInsight;
  }

  /**
   * Bulk create insights for an episode
   */
  static async createInsights(
    insights: Database['public']['Tables']['episode_insights']['Insert'][]
  ): Promise<EpisodeInsight[]> {
    const { data, error } = await supabase
      .from('episode_insights')
      .insert(insights)
      .select();

    if (error) throw error;
    return data as EpisodeInsight[];
  }
}
