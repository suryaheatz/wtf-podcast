/*
  # Extend Schema for Detailed Episode Content Mapping

  ## Overview
  This migration extends the existing podcast schema to support comprehensive episode content
  management including guests, insights, chapters, quotes, tactical advice, and more.

  ## Schema Changes

  ### 1. Episodes Table Update
  **Modified Columns:**
  - `framing` (TEXT) - Descriptive framing paragraph below title

  ### 2. New Table: guests
  Manages guest information independently for reusability across episodes
  - `id` (uuid, primary key) - Unique guest identifier
  - `name` (TEXT, NOT NULL) - Guest full name
  - `avatar_url` (TEXT) - Guest profile image URL
  - `bio` (TEXT) - Guest biography/credentials
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 3. New Table: episode_guests (Junction Table)
  Links episodes to multiple guests with custom metadata
  - `id` (uuid, primary key) - Unique record identifier
  - `episode_id` (uuid, foreign key) - Reference to episodes
  - `guest_id` (uuid, foreign key) - Reference to guests
  - `guest_tag` (TEXT) - Custom badge text (e.g., "The OG of Retail")
  - `display_order` (INTEGER) - Order of guest display
  - `created_at` (timestamptz) - Record creation timestamp
  - Composite unique constraint on (episode_id, guest_id)

  ### 4. New Table: episode_insights (Universal Content Table)
  Centralized table for all episode content types including metrics, quotes, chapters, etc.
  - `id` (uuid, primary key) - Unique insight identifier
  - `episode_id` (uuid, foreign key) - Reference to parent episode
  - `type` (TEXT, NOT NULL) - Content type enum
  - `title` (TEXT) - Headlines/labels
  - `content` (TEXT) - Main body content/context
  - `context` (TEXT) - Subtitles/footer text/phase descriptions
  - `metric_value` (TEXT) - For numeric/percentage displays
  - `metric_unit` (TEXT) - For unit labels (%, M, Cr, etc.)
  - `trend_direction` (TEXT) - For metric arrows (up, down, neutral)
  - `speaker` (TEXT) - Speaker name on cards/quotes
  - `timestamp_start` (TEXT) - Time pills (format: "HH:MM:SS")
  - `timestamp_seconds` (INTEGER) - Timestamp in seconds for seeking
  - `signal` (TEXT) - Knowledge chapter signals
  - `action_item` (TEXT) - Knowledge chapter next steps
  - `category_tag` (TEXT) - Knowledge chapter category tags
  - `display_order` (INTEGER) - Order of display within type
  - `metadata` (JSONB) - Flexible additional data
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  **Insight Types:**
  - 'tldr_summary' - AI-generated summary points
  - 'metric' - Key performance indicators and statistics
  - 'roadmap_item' - Playbook/timeline checklist items
  - 'quote' - Voice of authority quotes
  - 'tactical_advice' - Dos and Don'ts items
  - 'chapter' - Knowledge chapter cards
  - 'video_chapter' - Episode navigation chapters

  ## Security
  - Enable RLS on all new tables
  - Public read access for published content
  - Authenticated write access for content management

  ## Indexes
  - Foreign key relationships for fast joins
  - Type-based filtering for episode_insights
  - Display order for proper sequencing

  ## Notes
  - Uses UUID v4 for primary keys
  - Timestamps default to current time
  - JSONB metadata allows schema flexibility
  - Supports multiple guests per episode
  - Unified content model reduces schema complexity
*/

-- =====================================================
-- 1. UPDATE EXISTING TABLE: episodes
-- =====================================================

-- Add framing column to episodes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'framing'
  ) THEN
    ALTER TABLE episodes ADD COLUMN framing TEXT;
  END IF;
END $$;

-- =====================================================
-- 2. CREATE NEW TABLE: guests
-- =====================================================

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for guest name lookups
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);

-- =====================================================
-- 3. CREATE NEW TABLE: episode_guests (Junction)
-- =====================================================

CREATE TABLE IF NOT EXISTS episode_guests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  guest_tag TEXT,
  display_order INTEGER DEFAULT 0,
  created_at timestamptz DEFAULT now(),

  -- Ensure unique episode-guest pairs
  UNIQUE(episode_id, guest_id)
);

-- Create indexes for junction table queries
CREATE INDEX IF NOT EXISTS idx_episode_guests_episode_id ON episode_guests(episode_id);
CREATE INDEX IF NOT EXISTS idx_episode_guests_guest_id ON episode_guests(guest_id);
CREATE INDEX IF NOT EXISTS idx_episode_guests_order ON episode_guests(episode_id, display_order);

-- =====================================================
-- 4. CREATE NEW TABLE: episode_insights
-- =====================================================

CREATE TABLE IF NOT EXISTS episode_insights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'tldr_summary',
    'metric',
    'roadmap_item',
    'quote',
    'tactical_advice',
    'chapter',
    'video_chapter'
  )),
  title TEXT,
  content TEXT,
  context TEXT,
  metric_value TEXT,
  metric_unit TEXT,
  trend_direction TEXT,
  speaker TEXT,
  timestamp_start TEXT,
  timestamp_seconds INTEGER DEFAULT 0,
  signal TEXT,
  action_item TEXT,
  category_tag TEXT,
  display_order INTEGER DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_episode_insights_episode_id ON episode_insights(episode_id);
CREATE INDEX IF NOT EXISTS idx_episode_insights_type ON episode_insights(type);
CREATE INDEX IF NOT EXISTS idx_episode_insights_episode_type ON episode_insights(episode_id, type);
CREATE INDEX IF NOT EXISTS idx_episode_insights_order ON episode_insights(episode_id, type, display_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_insights ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GUESTS POLICIES
-- =====================================================

-- Public read access to all guests
CREATE POLICY "Anyone can view guests"
  ON guests FOR SELECT
  USING (true);

-- Authenticated users can create guests
CREATE POLICY "Authenticated users can create guests"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update guests
CREATE POLICY "Authenticated users can update guests"
  ON guests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete guests
CREATE POLICY "Authenticated users can delete guests"
  ON guests FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- EPISODE_GUESTS POLICIES
-- =====================================================

-- Public read access to episode-guest relationships
CREATE POLICY "Anyone can view episode guests"
  ON episode_guests FOR SELECT
  USING (true);

-- Authenticated users can create episode-guest relationships
CREATE POLICY "Authenticated users can create episode guests"
  ON episode_guests FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update episode-guest relationships
CREATE POLICY "Authenticated users can update episode guests"
  ON episode_guests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete episode-guest relationships
CREATE POLICY "Authenticated users can delete episode guests"
  ON episode_guests FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- EPISODE_INSIGHTS POLICIES
-- =====================================================

-- Public read access to insights from published episodes
CREATE POLICY "Anyone can view insights from published episodes"
  ON episode_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM episodes
      WHERE episodes.id = episode_insights.episode_id
      AND episodes.is_published = true
    )
  );

-- Authenticated users can view all insights
CREATE POLICY "Authenticated users can view all insights"
  ON episode_insights FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create insights
CREATE POLICY "Authenticated users can create insights"
  ON episode_insights FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update insights
CREATE POLICY "Authenticated users can update insights"
  ON episode_insights FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete insights
CREATE POLICY "Authenticated users can delete insights"
  ON episode_insights FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Add trigger for guests table
DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for episode_insights table
DROP TRIGGER IF EXISTS update_episode_insights_updated_at ON episode_insights;
CREATE TRIGGER update_episode_insights_updated_at
  BEFORE UPDATE ON episode_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for episodes with all related content
CREATE OR REPLACE VIEW episode_full_details AS
SELECT
  e.*,
  p.name as podcast_name,
  p.slug as podcast_slug,
  (
    SELECT json_agg(
      json_build_object(
        'id', g.id,
        'name', g.name,
        'avatar_url', g.avatar_url,
        'bio', g.bio,
        'guest_tag', eg.guest_tag,
        'display_order', eg.display_order
      ) ORDER BY eg.display_order
    )
    FROM episode_guests eg
    JOIN guests g ON g.id = eg.guest_id
    WHERE eg.episode_id = e.id
  ) as guests,
  (
    SELECT json_agg(
      json_build_object(
        'id', ei.id,
        'type', ei.type,
        'title', ei.title,
        'content', ei.content,
        'context', ei.context,
        'metric_value', ei.metric_value,
        'metric_unit', ei.metric_unit,
        'trend_direction', ei.trend_direction,
        'speaker', ei.speaker,
        'timestamp_start', ei.timestamp_start,
        'timestamp_seconds', ei.timestamp_seconds,
        'signal', ei.signal,
        'action_item', ei.action_item,
        'category_tag', ei.category_tag,
        'display_order', ei.display_order,
        'metadata', ei.metadata
      ) ORDER BY ei.display_order
    )
    FROM episode_insights ei
    WHERE ei.episode_id = e.id
  ) as insights
FROM episodes e
JOIN podcasts p ON e.podcast_id = p.id
WHERE e.is_published = true
  AND p.is_active = true;

-- Grant access to the view
GRANT SELECT ON episode_full_details TO anon, authenticated;
