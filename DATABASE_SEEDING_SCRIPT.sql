/*
  ==========================================
  DATABASE SEEDING SCRIPT
  ==========================================

  This script seeds the database with the current hardcoded content
  from the application, allowing immediate testing of the data-driven
  UI components.

  IMPORTANT: Replace '<EPISODE_ID>' and '<PODCAST_ID>' with actual UUIDs
  from your database after creating the podcast and episode records.

  PREREQUISITE: Ensure you have created:
  1. A podcast record in the 'podcasts' table
  2. An episode record in the 'episodes' table
*/

-- ==========================================
-- STEP 1: UPDATE EPISODE WITH NEW FIELDS
-- ==========================================

-- Update the episode with framing text
UPDATE episodes
SET
  title = 'Scaling Consumer Brands in India',
  framing = 'A definitive masterclass on Indian consumption. Kishore Biyani breaks down the ''India 1'' demographic, Ananth Narayanan reveals the unit economics of scaling, and Raj Shamani decodes the science of attention.',
  episode_number = 1
WHERE id = '<EPISODE_ID>';

-- ==========================================
-- STEP 2: CREATE GUESTS
-- ==========================================

-- Insert guests (save the returned IDs for next step)
INSERT INTO guests (id, name, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kishore Biyani', 'Founder of Future Group and pioneer of modern retail in India, revolutionized the Indian retail landscape'),
  ('22222222-2222-2222-2222-222222222222', 'Ananth Narayanan', 'Former CEO of Myntra, expert in scaling consumer brands from 0 to 100+ Crore'),
  ('33333333-3333-3333-3333-333333333333', 'Raj Shamani', 'Content creator and entrepreneur, expert in building attention and community'),
  ('44444444-4444-4444-4444-444444444444', 'Nikhil Kamath', 'Co-founder of Zerodha, investor and investigator of business models');

-- ==========================================
-- STEP 3: LINK GUESTS TO EPISODE
-- ==========================================

INSERT INTO episode_guests (episode_id, guest_id, guest_tag, display_order) VALUES
  ('<EPISODE_ID>', '11111111-1111-1111-1111-111111111111', 'The OG of Retail', 0),
  ('<EPISODE_ID>', '22222222-2222-2222-2222-222222222222', 'Scale Operator', 1),
  ('<EPISODE_ID>', '33333333-3333-3333-3333-333333333333', 'Content Capitalist', 2),
  ('<EPISODE_ID>', '44444444-4444-4444-4444-444444444444', 'Investigator', 3);

-- ==========================================
-- STEP 4: TLDR SUMMARY (AI Executive Summary)
-- ==========================================

INSERT INTO episode_insights (episode_id, type, content, display_order) VALUES
  ('<EPISODE_ID>', 'tldr_summary', 'The ''India 1'' Thesis: Only ~30M households (120M people) drive 60-70% of all value-added consumption.', 0),
  ('<EPISODE_ID>', 'tldr_summary', 'The 0-20-100 Rule: 0-20Cr is built on Product & Community. 20-100Cr is Performance Marketing. 100Cr+ requires Offline.', 1),
  ('<EPISODE_ID>', 'tldr_summary', 'Content Strategy: Use the ''ECG'' format (Evergreen, Controversial, Growth) to build attention without ad spend.', 2);

-- ==========================================
-- STEP 5: MARKET SIGNALS (Metrics)
-- ==========================================

INSERT INTO episode_insights (episode_id, type, title, content, metric_value, metric_unit, category_tag, display_order) VALUES
  ('<EPISODE_ID>', 'metric', '30M Households', 'Target market size equivalent to Singapore, Poland, or Mexico that drives 60-70% of India''s value-added consumption', '30', 'M', 'TARGET MARKET', 0),
  ('<EPISODE_ID>', 'metric', '60-70%', 'Percentage of total consumption value driven by top 30M households', '60-70', '%', 'MARKET CONCENTRATION', 1),
  ('<EPISODE_ID>', 'metric', '80/20 Split', 'Optimal distribution mix: 80% marketplace for reach, 20% D2C for brand control', '80/20', '', 'DISTRIBUTION', 2);

-- ==========================================
-- STEP 6: THE PLAYBOOK (Roadmap Items)
-- ==========================================

-- Phase: 0 — 20 Cr (PRODUCT & COMMUNITY)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
  ('<EPISODE_ID>', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Target a ''Micro-Niche'' (e.g., Toilet Seat Sprays, Pet Accessories)', 0),
  ('<EPISODE_ID>', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Maintain 80% Marketplace / 20% D2C mix for cash flow', 1),
  ('<EPISODE_ID>', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Do NOT spend on Performance Marketing yet', 2);

-- Phase: 20 — 100 Cr (PERFORMANCE & EFFICIENCY)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
  ('<EPISODE_ID>', 'roadmap_item', '20 — 100 Cr', 'PERFORMANCE & EFFICIENCY', 'Master Amazon/Meta Ads (CAC vs LTV)', 3),
  ('<EPISODE_ID>', 'roadmap_item', '20 — 100 Cr', 'PERFORMANCE & EFFICIENCY', 'Build the ''Hero SKU'' (30% of revenue from 1 product)', 4),
  ('<EPISODE_ID>', 'roadmap_item', '20 — 100 Cr', 'PERFORMANCE & EFFICIENCY', 'Optimize Supply Chain for speed (width over depth)', 5);

-- Phase: 100 Cr + (BRAND & OFFLINE)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
  ('<EPISODE_ID>', 'roadmap_item', '100 Cr +', 'BRAND & OFFLINE', 'Open Flagship Stores (Trust & Touch)', 6),
  ('<EPISODE_ID>', 'roadmap_item', '100 Cr +', 'BRAND & OFFLINE', 'Shift from ''Push'' (Ads) to ''Pull'' (Brand) sales', 7),
  ('<EPISODE_ID>', 'roadmap_item', '100 Cr +', 'BRAND & OFFLINE', 'Expand Category (Add layers to the core product)', 8);

-- ==========================================
-- STEP 7: DOS AND DON'TS (Tactical Advice)
-- ==========================================

-- DOs
INSERT INTO episode_insights (episode_id, type, title, content, context, display_order) VALUES
  ('<EPISODE_ID>', 'tactical_advice', 'Focus on India 1 Demographic', 'Target the top 30M households that drive 60-70% of consumption value.', 'DO', 0),
  ('<EPISODE_ID>', 'tactical_advice', 'Build Product-Market Fit First', '0-20Cr phase must be built on authentic product reviews and community, not ads.', 'DO', 1),
  ('<EPISODE_ID>', 'tactical_advice', 'Maintain 80/20 Distribution Mix', 'Keep 80% marketplace and 20% D2C split for healthy cash flow in early stages.', 'DO', 2),
  ('<EPISODE_ID>', 'tactical_advice', 'Create Your Hero SKU', 'Identify and double down on your flagship product that drives majority of revenue.', 'DO', 3),
  ('<EPISODE_ID>', 'tactical_advice', 'Use ECG Content Strategy', 'Balance Evergreen, Controversial, and Growth content to build organic attention.', 'DO', 4),
  ('<EPISODE_ID>', 'tactical_advice', 'Invest in Supply Chain Early', 'Offline distribution becomes critical post-100Cr; prepare infrastructure beforehand.', 'DO', 5);

-- DON'Ts
INSERT INTO episode_insights (episode_id, type, title, content, context, display_order) VALUES
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Use Performance Marketing Too Early', 'Burning cash on ads before PMF artificially inflates growth and destroys unit economics.', 'DONT', 0),
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Target All 1.4 Billion People', 'Mass market approach dilutes brand positioning. Focus beats reach in consumer brands.', 'DONT', 1),
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Skip Community Building', 'Brands that scale without authentic community face customer retention issues later.', 'DONT', 2),
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Ignore Unit Economics', 'Growing revenue without profitable unit economics is building a house of cards.', 'DONT', 3),
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Over-Index on D2C Only', 'Pure D2C models struggle with scale. Marketplaces provide necessary distribution reach.', 'DONT', 4),
  ('<EPISODE_ID>', 'tactical_advice', 'Don''t Delay Offline Strategy', 'Waiting until 100Cr to think about offline means losing 2 years of market development.', 'DONT', 5);

-- ==========================================
-- STEP 8: KNOWLEDGE CHAPTERS
-- ==========================================

INSERT INTO episode_insights (
  episode_id, type, category_tag, timestamp_start, timestamp_seconds,
  title, content, signal, action_item, speaker, display_order
) VALUES
  (
    '<EPISODE_ID>', 'chapter', 'MARKET STRATEGY', '00:52:42', 3162,
    'The ''India 1'' Theory',
    'Don''t get fooled by the 1.4 Billion population number. Real purchasing power is concentrated.',
    '30M households (Singapore/Poland/Mexico equivalents) drive 60-70% of value-added consumption.',
    'Target the top 100M. Ignore the rest for premium brand building.',
    'Kishore Biyani',
    0
  ),
  (
    '<EPISODE_ID>', 'chapter', 'EXECUTION', '01:25:13', 5113,
    '0 to 20 Crores: The Trap',
    'Founders often use Performance Marketing too early to fake growth.',
    '0-20Cr must be built on Product Market Fit, Reviews, and Community. Ads are premature growth steroids.',
    'Build organic traction first. Only scale with paid ads after PMF is proven.',
    'Ananth Narayanan',
    1
  ),
  (
    '<EPISODE_ID>', 'chapter', 'CONTENT', '02:15:45', 8145,
    'ECG Content Framework',
    'Most brands waste money on ads when they should be building attention through content.',
    'Use Evergreen (timeless), Controversial (debate-worthy), and Growth (trending) content to build organic reach.',
    'Create a content calendar with 40% Evergreen, 30% Controversial, 30% Growth content.',
    'Raj Shamani',
    2
  ),
  (
    '<EPISODE_ID>', 'chapter', 'DISTRIBUTION', '02:45:30', 9930,
    'The Hero SKU Strategy',
    'Most D2C brands fail because they dilute focus across too many products.',
    'Aim for 30% of revenue from your single best product (Hero SKU). This simplifies operations and marketing.',
    'Identify your Hero SKU within first 2 years. Double down on it for scale.',
    'Ananth Narayanan',
    3
  );

-- ==========================================
-- STEP 9: VIDEO CHAPTERS (Episode Navigation)
-- ==========================================

INSERT INTO episode_insights (
  episode_id, type, timestamp_start, timestamp_seconds,
  title, content, display_order
) VALUES
  ('<EPISODE_ID>', 'video_chapter', '00:00', 0, 'Introduction to Consumer Brands', 'Overview of the Indian consumer market and key growth drivers', 0),
  ('<EPISODE_ID>', 'video_chapter', '05:30', 330, 'The 0-20 Cr Phase', 'Product-market fit and building initial community traction', 1),
  ('<EPISODE_ID>', 'video_chapter', '12:45', 765, 'Scaling to 100 Cr', 'Performance marketing strategies and CAC optimization', 2),
  ('<EPISODE_ID>', 'video_chapter', '23:15', 1395, 'Building the Hero SKU', 'How to identify and scale your flagship product', 3),
  ('<EPISODE_ID>', 'video_chapter', '34:20', 2060, 'D2C vs Marketplace Mix', 'Optimizing distribution channels for sustainable growth', 4),
  ('<EPISODE_ID>', 'video_chapter', '42:00', 2520, 'Brand Building at Scale', 'Transitioning from performance marketing to brand marketing', 5);

-- ==========================================
-- STEP 10: QUOTES (Voice of Authority)
-- ==========================================

-- Note: For legacy quotes table compatibility, you might want to keep using the original quotes table
-- However, you can also use episode_insights with type='quote' for consistency

INSERT INTO episode_insights (
  episode_id, type, content, speaker, timestamp_start, timestamp_seconds,
  context, display_order
) VALUES
  (
    '<EPISODE_ID>', 'quote',
    'The moment you realize that only 30 million households matter, your entire strategy changes. You stop chasing 1.4 billion people and start building for the right 120 million.',
    'Kishore Biyani',
    '00:52:42', 3162,
    'On understanding the India 1 demographic and targeting strategy',
    0
  ),
  (
    '<EPISODE_ID>', 'quote',
    'Between 0 to 20 crores, if you''re spending money on Facebook ads, you''re basically burning cash to inflate a vanity metric. Build the product, get reviews, create community first.',
    'Ananth Narayanan',
    '01:25:13', 5113,
    'On the critical mistake founders make in early-stage scaling',
    1
  ),
  (
    '<EPISODE_ID>', 'quote',
    'Content is not marketing. Content is the product. If you can''t build attention organically, you don''t have product-market fit.',
    'Raj Shamani',
    '02:15:45', 8145,
    'On the role of content in building consumer brands',
    2
  ),
  (
    '<EPISODE_ID>', 'quote',
    'Your Hero SKU should represent 30% of your revenue. If you have 50 products and they''re all equal, you don''t have a brand—you have a supermarket.',
    'Ananth Narayanan',
    '02:45:30', 9930,
    'On the importance of focus and the Hero SKU strategy',
    3
  );

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- After running the above inserts, verify the data:

-- Check episode details
SELECT * FROM episodes WHERE id = '<EPISODE_ID>';

-- Check guests
SELECT * FROM guests;

-- Check episode-guest relationships
SELECT
  g.name,
  eg.guest_tag,
  eg.display_order
FROM episode_guests eg
JOIN guests g ON g.id = eg.guest_id
WHERE eg.episode_id = '<EPISODE_ID>'
ORDER BY eg.display_order;

-- Check insights by type
SELECT type, COUNT(*) as count
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>'
GROUP BY type
ORDER BY type;

-- Check TLDR summary
SELECT content
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>' AND type = 'tldr_summary'
ORDER BY display_order;

-- Check roadmap items grouped by phase
SELECT title as phase, context as category, content
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>' AND type = 'roadmap_item'
ORDER BY display_order;

-- Check tactical advice (Dos and Don'ts)
SELECT
  CASE WHEN context = 'DO' THEN 'DO' ELSE 'DON''T' END as advice_type,
  title,
  content
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>' AND type = 'tactical_advice'
ORDER BY context, display_order;

-- Check knowledge chapters
SELECT
  category_tag,
  timestamp_start,
  title,
  speaker
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>' AND type = 'chapter'
ORDER BY display_order;

-- Check video chapters
SELECT
  timestamp_start,
  title,
  content
FROM episode_insights
WHERE episode_id = '<EPISODE_ID>' AND type = 'video_chapter'
ORDER BY display_order;

-- ==========================================
-- USAGE NOTES
-- ==========================================

/*
  1. Replace '<EPISODE_ID>' with your actual episode UUID
  2. Replace '<PODCAST_ID>' if needed in any custom queries
  3. Run this script using Supabase SQL Editor or pgAdmin
  4. Verify data using the verification queries at the end
  5. Test the frontend to see data-driven components in action

  After seeding:
  - All sections will display database-driven content
  - Hardcoded fallbacks will no longer be used
  - You can modify content via database instead of code changes
*/

-- ==========================================
-- HELPER: Get Episode ID from Episode Number
-- ==========================================

-- If you know the episode number but not the ID:
-- SELECT id FROM episodes WHERE episode_number = 1 AND podcast_id = '<PODCAST_ID>';
