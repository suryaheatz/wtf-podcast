/*
  # Fix Remaining Security Issues

  ## Overview
  This migration addresses the remaining security and performance issues:
  1. Recreates essential indexes on foreign keys for optimal query performance
  2. Properly removes SECURITY DEFINER from views to prevent privilege escalation

  ## Changes Made

  ### 1. Recreate Essential Foreign Key Indexes
  Foreign key columns MUST have indexes to prevent full table scans during joins and cascading deletes.
  These indexes were incorrectly removed in the previous migration:
  
  **episode_guests table:**
  - `idx_episode_guests_guest_id` on `guest_id` - Required for reverse lookups and cascade deletes
  
  **episode_insights table:**
  - `idx_episode_insights_episode_id` on `episode_id` - Required for episode content queries
  
  **quotes table:**
  - `idx_quotes_episode_id` on `episode_id` - Required for episode quote queries

  ### 2. Fix SECURITY DEFINER Views
  Views must be recreated without SECURITY DEFINER to respect RLS policies:
  - `latest_episodes` - Must run with caller privileges
  - `episode_full_details` - Must run with caller privileges

  ## Security Rationale
  - Foreign key indexes prevent performance degradation that could lead to DoS
  - Views without SECURITY DEFINER respect RLS and prevent privilege escalation
  - These changes align with PostgreSQL and Supabase security best practices

  ## Performance Impact
  - ✅ Significantly improved join performance on foreign key relationships
  - ✅ Faster CASCADE DELETE operations
  - ✅ Proper RLS enforcement on views
*/

-- =====================================================
-- 1. RECREATE ESSENTIAL FOREIGN KEY INDEXES
-- =====================================================

-- Foreign key index for episode_guests.guest_id
-- Required for: SELECT * FROM episode_guests WHERE guest_id = ?
-- Required for: CASCADE DELETE when a guest is removed
CREATE INDEX IF NOT EXISTS idx_episode_guests_guest_id ON episode_guests(guest_id);

-- Foreign key index for episode_insights.episode_id
-- Required for: SELECT * FROM episode_insights WHERE episode_id = ?
-- Required for: CASCADE DELETE when an episode is removed
CREATE INDEX IF NOT EXISTS idx_episode_insights_episode_id ON episode_insights(episode_id);

-- Foreign key index for quotes.episode_id
-- Required for: SELECT * FROM quotes WHERE episode_id = ?
-- Required for: CASCADE DELETE when an episode is removed
CREATE INDEX IF NOT EXISTS idx_quotes_episode_id ON quotes(episode_id);

-- =====================================================
-- 2. FIX SECURITY DEFINER VIEWS (PROPERLY)
-- =====================================================

-- Drop and recreate latest_episodes WITHOUT SECURITY DEFINER
DROP VIEW IF EXISTS latest_episodes CASCADE;

CREATE VIEW latest_episodes 
WITH (security_invoker = true)
AS
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

GRANT SELECT ON latest_episodes TO anon, authenticated;

-- Drop and recreate episode_full_details WITHOUT SECURITY DEFINER
DROP VIEW IF EXISTS episode_full_details CASCADE;

CREATE VIEW episode_full_details
WITH (security_invoker = true)
AS
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

GRANT SELECT ON episode_full_details TO anon, authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify indexes exist:
-- SELECT tablename, indexname FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND indexname IN (
--   'idx_episode_guests_guest_id',
--   'idx_episode_insights_episode_id', 
--   'idx_quotes_episode_id'
-- );

-- Verify views are security_invoker:
-- SELECT viewname, 
--        pg_get_viewdef(viewname::regclass, true) as definition
-- FROM pg_views 
-- WHERE schemaname = 'public' 
-- AND viewname IN ('latest_episodes', 'episode_full_details');
