export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type InsightType =
  | 'tldr_summary'
  | 'metric'
  | 'roadmap_item'
  | 'quote'
  | 'tactical_advice'
  | 'chapter'
  | 'video_chapter';

export type EpisodeInsightRow = Database["public"]["Tables"]["episode_insights"]["Row"];
export type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];
export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];

export interface Database {
  public: {
    Tables: {
      podcasts: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          cover_image_url: string | null
          youtube_channel_id: string | null
          host_name: string | null
          host_bio: string | null
          categories: string[] | null
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          cover_image_url?: string | null
          youtube_channel_id?: string | null
          host_name?: string | null
          host_bio?: string | null
          categories?: string[] | null
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          cover_image_url?: string | null
          youtube_channel_id?: string | null
          host_name?: string | null
          host_bio?: string | null
          categories?: string[] | null
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      episodes: {
        Row: {
          id: string
          podcast_id: string
          episode_number: number
          title: string
          description: string | null
          framing: string | null
          guest_name: string | null
          guest_bio: string | null
          youtube_video_id: string | null
          duration_minutes: number
          release_date: string
          thumbnail_url: string | null
          categories: string[] | null
          view_count: number
          is_published: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          podcast_id: string
          episode_number: number
          title: string
          description?: string | null
          framing?: string | null
          guest_name?: string | null
          guest_bio?: string | null
          youtube_video_id?: string | null
          duration_minutes?: number
          release_date: string
          thumbnail_url?: string | null
          categories?: string[] | null
          view_count?: number
          is_published?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          podcast_id?: string
          episode_number?: number
          title?: string
          description?: string | null
          framing?: string | null
          guest_name?: string | null
          guest_bio?: string | null
          youtube_video_id?: string | null
          duration_minutes?: number
          release_date?: string
          thumbnail_url?: string | null
          categories?: string[] | null
          view_count?: number
          is_published?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      episode_guests: {
        Row: {
          id: string
          episode_id: string
          guest_id: string
          guest_tag: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          episode_id: string
          guest_id: string
          guest_tag?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          episode_id?: string
          guest_id?: string
          guest_tag?: string | null
          display_order?: number
          created_at?: string
        }
      }
      episode_insights: {
        Row: {
          id: string
          episode_id: string
          type: InsightType
          title: string | null
          content: string | null
          context: string | null
          metric_value: string | null
          metric_unit: string | null
          trend_direction: string | null
          speaker: string | null
          timestamp_start: string | null
          timestamp_seconds: number
          signal: string | null
          action_item: string | null
          category_tag: string | null
          display_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          episode_id: string
          type: InsightType
          title?: string | null
          content?: string | null
          context?: string | null
          metric_value?: string | null
          metric_unit?: string | null
          trend_direction?: string | null
          speaker?: string | null
          timestamp_start?: string | null
          timestamp_seconds?: number
          signal?: string | null
          action_item?: string | null
          category_tag?: string | null
          display_order?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          episode_id?: string
          type?: InsightType
          title?: string | null
          content?: string | null
          context?: string | null
          metric_value?: string | null
          metric_unit?: string | null
          trend_direction?: string | null
          speaker?: string | null
          timestamp_start?: string | null
          timestamp_seconds?: number
          signal?: string | null
          action_item?: string | null
          category_tag?: string | null
          display_order?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          episode_id: string
          podcast_id: string
          quote_text: string
          author: string
          timestamp: string | null
          timestamp_seconds: number
          description: string | null
          gradient: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          episode_id: string
          podcast_id: string
          quote_text: string
          author: string
          timestamp?: string | null
          timestamp_seconds?: number
          description?: string | null
          gradient?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          episode_id?: string
          podcast_id?: string
          quote_text?: string
          author?: string
          timestamp?: string | null
          timestamp_seconds?: number
          description?: string | null
          gradient?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      latest_episodes: {
        Row: {
          id: string
          podcast_id: string
          episode_number: number
          title: string
          description: string | null
          framing: string | null
          guest_name: string | null
          guest_bio: string | null
          youtube_video_id: string | null
          duration_minutes: number
          release_date: string
          thumbnail_url: string | null
          categories: string[] | null
          view_count: number
          is_published: boolean
          metadata: Json
          created_at: string
          updated_at: string
          podcast_name: string
          podcast_slug: string
          podcast_cover: string | null
        }
      }
      episode_full_details: {
        Row: {
          id: string
          podcast_id: string
          episode_number: number
          title: string
          description: string | null
          framing: string | null
          guest_name: string | null
          guest_bio: string | null
          youtube_video_id: string | null
          duration_minutes: number
          release_date: string
          thumbnail_url: string | null
          categories: string[] | null
          view_count: number
          is_published: boolean
          metadata: Json
          created_at: string
          updated_at: string
          podcast_name: string
          podcast_slug: string
          guests: Json | null
          insights: Json | null
        }
      }
    }
  }
}

// Helper types for joined data
export interface GuestWithTag {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  guest_tag: string | null
  display_order: number
}

export type EpisodeInsight = Database["public"]["Tables"]["episode_insights"]["Row"];

export type EpisodeWithDetails =
  Database["public"]["Tables"]["episodes"]["Row"] & {
    id: string;
    episode_number: number;
    title: string;
    description: string | null;
    framing: string | null;
    guest_name: string | null;
    guest_bio: string | null;
    youtube_video_id: string | null;
    duration_minutes: number;
    release_date: string;
    thumbnail_url: string | null;
    metadata: Json;
    podcast_name?: string;
    podcast_slug?: string;
    guests?: GuestWithTag[];
    insights?: EpisodeInsight[];
  };
