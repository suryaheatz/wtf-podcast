/*
  # Create Podcast Database Schema

  ## Overview
  This migration creates a complete database schema for a dynamic podcast website with support for:
  - Multiple podcasts
  - Episodes with rich metadata
  - Quotes/highlights from episodes
  - Categories/tags
  - YouTube integration
  - SEO optimization

  ## New Tables

  ### `podcasts`
  Main podcast information table
  - `id` (uuid, primary key) - Unique podcast identifier
  - `slug` (text, unique) - URL-friendly identifier for routing
  - `name` (text) - Podcast name/title
  - `description` (text) - Podcast description
  - `cover_image_url` (text) - Podcast artwork/logo
  - `youtube_channel_id` (text) - YouTube channel identifier
  - `host_name` (text) - Primary host name
  - `host_bio` (text) - Host biography
  - `categories` (text[]) - Array of category tags
  - `is_active` (boolean) - Whether podcast is currently active
  - `metadata` (jsonb) - Flexible metadata storage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `episodes`
  Individual podcast episodes
  - `id` (uuid, primary key) - Unique episode identifier
  - `podcast_id` (uuid, foreign key) - Reference to parent podcast
  - `episode_number` (integer) - Sequential episode number
  - `title` (text) - Episode title
  - `description` (text) - Episode description/show notes
  - `guest_name` (text) - Featured guest name
  - `guest_bio` (text) - Guest biography/credentials
  - `youtube_video_id` (text) - YouTube video identifier
  - `duration_minutes` (integer) - Episode duration in minutes
  - `release_date` (date) - Publication date
  - `thumbnail_url` (text) - Episode thumbnail image
  - `categories` (text[]) - Episode-specific tags
  - `view_count` (integer) - View counter
  - `is_published` (boolean) - Publication status
  - `metadata` (jsonb) - Flexible metadata storage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `quotes`
  Memorable quotes and highlights from episodes
  - `id` (uuid, primary key) - Unique quote identifier
  - `episode_id` (uuid, foreign key) - Reference to parent episode
  - `podcast_id` (uuid, foreign key) - Reference to parent podcast
  - `quote_text` (text) - The actual quote
  - `author` (text) - Person who said the quote
  - `timestamp` (text) - Video timestamp (HH:MM:SS or MM:SS)
  - `timestamp_seconds` (integer) - Timestamp in seconds for seeking
  - `description` (text) - Context or explanation
  - `gradient` (text) - Visual gradient for card styling
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Authenticated write access for content management

  ## Indexes
  - Slug lookup for podcasts
  - Episode number and release date sorting
  - Quote timestamp searching
  - Category filtering

  ## Notes
  - Uses UUID v4 for primary keys
  - Timestamps default to current time
  - JSONB metadata allows schema flexibility
  - Array fields for multi-category support
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: podcasts
-- =====================================================
CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  cover_image_url text,
  youtube_channel_id text,
  host_name text,
  host_bio text,
  categories text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_podcasts_slug ON podcasts(slug);
CREATE INDEX IF NOT EXISTS idx_podcasts_active ON podcasts(is_active) WHERE is_active = true;

-- =====================================================
-- TABLE: episodes
-- =====================================================
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  podcast_id uuid NOT NULL REFERENCES podcasts(id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  title text NOT NULL,
  description text,
  guest_name text,
  guest_bio text,
  youtube_video_id text,
  duration_minutes integer DEFAULT 0,
  release_date date NOT NULL,
  thumbnail_url text,
  categories text[] DEFAULT '{}',
  view_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique episode numbers per podcast
  UNIQUE(podcast_id, episode_number)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_episodes_podcast_id ON episodes(podcast_id);
CREATE INDEX IF NOT EXISTS idx_episodes_release_date ON episodes(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_published ON episodes(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON episodes(podcast_id, episode_number);

-- =====================================================
-- TABLE: quotes
-- =====================================================
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  podcast_id uuid NOT NULL REFERENCES podcasts(id) ON DELETE CASCADE,
  quote_text text NOT NULL,
  author text NOT NULL,
  timestamp text,
  timestamp_seconds integer DEFAULT 0,
  description text,
  gradient text DEFAULT 'from-[#1a1a1a] to-[#252525]',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for quote queries
CREATE INDEX IF NOT EXISTS idx_quotes_episode_id ON quotes(episode_id);
CREATE INDEX IF NOT EXISTS idx_quotes_podcast_id ON quotes(podcast_id);
CREATE INDEX IF NOT EXISTS idx_quotes_order ON quotes(order_index);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PODCASTS POLICIES
-- =====================================================

-- Public read access to active podcasts
CREATE POLICY "Anyone can view active podcasts"
  ON podcasts FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all podcasts
CREATE POLICY "Authenticated users can view all podcasts"
  ON podcasts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create podcasts
CREATE POLICY "Authenticated users can create podcasts"
  ON podcasts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update podcasts
CREATE POLICY "Authenticated users can update podcasts"
  ON podcasts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete podcasts
CREATE POLICY "Authenticated users can delete podcasts"
  ON podcasts FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- EPISODES POLICIES
-- =====================================================

-- Public read access to published episodes from active podcasts
CREATE POLICY "Anyone can view published episodes"
  ON episodes FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM podcasts
      WHERE podcasts.id = episodes.podcast_id
      AND podcasts.is_active = true
    )
  );

-- Authenticated users can view all episodes
CREATE POLICY "Authenticated users can view all episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create episodes
CREATE POLICY "Authenticated users can create episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update episodes
CREATE POLICY "Authenticated users can update episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete episodes
CREATE POLICY "Authenticated users can delete episodes"
  ON episodes FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- QUOTES POLICIES
-- =====================================================

-- Public read access to quotes from published episodes
CREATE POLICY "Anyone can view quotes from published episodes"
  ON quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM episodes
      WHERE episodes.id = quotes.episode_id
      AND episodes.is_published = true
    )
  );

-- Authenticated users can view all quotes
CREATE POLICY "Authenticated users can view all quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create quotes
CREATE POLICY "Authenticated users can create quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update quotes
CREATE POLICY "Authenticated users can update quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete quotes
CREATE POLICY "Authenticated users can delete quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
DROP TRIGGER IF EXISTS update_podcasts_updated_at ON podcasts;
CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_episodes_updated_at ON episodes;
CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON episodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for latest episodes with podcast info
CREATE OR REPLACE VIEW latest_episodes AS
SELECT 
  e.*,
  p.name as podcast_name,
  p.slug as podcast_slug,
  p.cover_image_url as podcast_cover
FROM episodes e
JOIN podcasts p ON e.podcast_id = p.id
WHERE e.is_published = true
  AND p.is_active = true
ORDER BY e.release_date DESC;

-- Grant access to the view
GRANT SELECT ON latest_episodes TO anon, authenticated;