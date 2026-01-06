/*
  # Seed Initial Podcast Data

  ## Overview
  This migration populates the database with initial podcast content including:
  - A sample podcast entry
  - 18 sample episodes
  - 5 key quotes from the main episode

  ## Data Inserted

  ### Podcast
  - Creates a single podcast entry for demonstration
  - Name: "Founder's Journey"
  - Host: Ananth Narayanan
  - YouTube video: hjiZ11lKCrU

  ### Episodes
  - 18 episodes covering various topics
  - Includes guest information, duration, and release dates
  - All episodes are marked as published

  ### Quotes
  - 5 memorable quotes from the featured episode
  - Includes timestamps, descriptions, and visual gradients
  - Links to the main podcast and episode

  ## Notes
  - Uses hardcoded UUIDs for reference consistency
  - All content is marked as active/published
  - Categories are assigned for filtering
*/

-- =====================================================
-- INSERT PODCAST
-- =====================================================
INSERT INTO podcasts (id, slug, name, description, host_name, host_bio, youtube_channel_id, categories, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'founders-journey',
  'Founder''s Journey',
  'Deep conversations with successful founders, exploring the challenges, insights, and lessons learned while building game-changing companies. From scaling operations to navigating markets, we uncover the real stories behind startup success.',
  'Ananth Narayanan',
  'Former CEO of Myntra and Medlife, now leading Mensa Brands. Serial entrepreneur with extensive experience in D2C, retail, and consumer tech.',
  'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  ARRAY['business', 'startups', 'entrepreneurship', 'technology'],
  true
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- INSERT EPISODES
-- =====================================================

-- Episode 1: AI & The Future of Work
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  1,
  'AI & The Future of Work',
  'Exploring how AI is reshaping industries and creating new opportunities',
  'Sarah Chen',
  'hjiZ11lKCrU',
  135,
  '2024-01-05',
  true,
  ARRAY['AI', 'technology', 'future of work']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 2: Crypto Regulation Deep Dive
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  2,
  'Crypto Regulation Deep Dive',
  'Understanding the evolving regulatory landscape for cryptocurrencies',
  'Michael Roberts',
  'hjiZ11lKCrU',
  105,
  '2024-01-12',
  true,
  ARRAY['crypto', 'regulation', 'finance']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 3: Mental Health for Founders
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  3,
  'Mental Health for Founders',
  'Building resilience and maintaining wellbeing while scaling',
  'Dr. Lisa Park',
  'hjiZ11lKCrU',
  125,
  '2024-01-19',
  true,
  ARRAY['mental health', 'founders', 'wellness']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 4: Building in Public
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440000',
  4,
  'Building in Public',
  'The power of transparency in building products and communities',
  'Kunal Shah',
  'hjiZ11lKCrU',
  115,
  '2024-01-26',
  true,
  ARRAY['product', 'community', 'transparency']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 5: The Creator Economy
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440000',
  5,
  'The Creator Economy',
  'How creators are building sustainable businesses in 2024',
  'Emma Johnson',
  'hjiZ11lKCrU',
  150,
  '2024-02-02',
  true,
  ARRAY['creator economy', 'content', 'monetization']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 6: SaaS Scaling Playbook
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440000',
  6,
  'SaaS Scaling Playbook',
  'Proven strategies for scaling B2B SaaS companies',
  'Alex Kumar',
  'hjiZ11lKCrU',
  130,
  '2024-02-09',
  true,
  ARRAY['SaaS', 'B2B', 'scaling']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 7: Climate Tech Opportunities
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440000',
  7,
  'Climate Tech Opportunities',
  'Investment trends and innovations in climate technology',
  'Rachel Green',
  'hjiZ11lKCrU',
  110,
  '2024-02-16',
  true,
  ARRAY['climate tech', 'sustainability', 'investment']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 8: D2C Brand Building
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  8,
  'D2C Brand Building',
  'Creating authentic connections with consumers',
  'David Martinez',
  'hjiZ11lKCrU',
  165,
  '2024-03-01',
  true,
  ARRAY['D2C', 'branding', 'consumer']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 9: VC Fundraising Masterclass
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440000',
  9,
  'VC Fundraising Masterclass',
  'Inside perspectives on raising venture capital',
  'Jennifer Lee',
  'hjiZ11lKCrU',
  135,
  '2024-03-08',
  true,
  ARRAY['venture capital', 'fundraising', 'investment']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 10: Gaming Industry in India
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440000',
  10,
  'Gaming Industry in India',
  'The explosive growth of gaming and esports',
  'Amit Patel',
  'hjiZ11lKCrU',
  100,
  '2024-03-15',
  true,
  ARRAY['gaming', 'esports', 'India']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 11: Web3 and Decentralization
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440000',
  11,
  'Web3 and Decentralization',
  'Building the next generation of internet applications',
  'Chris Anderson',
  'hjiZ11lKCrU',
  140,
  '2024-10-15',
  true,
  ARRAY['web3', 'blockchain', 'decentralization']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 12: EdTech Revolution
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440000',
  12,
  'EdTech Revolution',
  'Transforming education through technology',
  'Dr. Priya Sharma',
  'hjiZ11lKCrU',
  115,
  '2024-04-05',
  true,
  ARRAY['edtech', 'education', 'learning']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 13: FinTech Innovation
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440000',
  13,
  'FinTech Innovation',
  'Disrupting traditional banking with technology',
  'James Wilson',
  'hjiZ11lKCrU',
  130,
  '2024-04-12',
  true,
  ARRAY['fintech', 'banking', 'payments']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 14: Supply Chain Tech
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440000',
  14,
  'Supply Chain Tech',
  'Optimizing global supply chains with AI and IoT',
  'Maria Santos',
  'hjiZ11lKCrU',
  105,
  '2024-05-03',
  true,
  ARRAY['supply chain', 'logistics', 'AI']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 15: Healthcare Innovation
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440000',
  15,
  'Healthcare Innovation',
  'Technology-driven healthcare solutions',
  'Dr. Robert Chen',
  'hjiZ11lKCrU',
  145,
  '2024-05-17',
  true,
  ARRAY['healthcare', 'healthtech', 'innovation']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 16: Food Tech Future
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440000',
  16,
  'Food Tech Future',
  'Sustainable food production and delivery',
  'Sophie Miller',
  'hjiZ11lKCrU',
  110,
  '2024-06-07',
  true,
  ARRAY['foodtech', 'sustainability', 'delivery']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 17: Mobility and Transportation
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440000',
  17,
  'Mobility and Transportation',
  'The future of how we move in cities',
  'Tom Anderson',
  'hjiZ11lKCrU',
  125,
  '2024-06-21',
  true,
  ARRAY['mobility', 'transportation', 'urban']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- Episode 18: Space Tech Ventures
INSERT INTO episodes (id, podcast_id, episode_number, title, description, guest_name, youtube_video_id, duration_minutes, release_date, is_published, categories)
VALUES (
  '650e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440000',
  18,
  'Space Tech Ventures',
  'Commercial opportunities in space exploration',
  'Dr. Sarah Mitchell',
  'hjiZ11lKCrU',
  135,
  '2024-07-12',
  true,
  ARRAY['space tech', 'aerospace', 'exploration']
) ON CONFLICT (podcast_id, episode_number) DO NOTHING;

-- =====================================================
-- INSERT QUOTES
-- =====================================================

-- Quote 1
INSERT INTO quotes (id, episode_id, podcast_id, quote_text, author, timestamp, timestamp_seconds, description, gradient, order_index)
VALUES (
  '750e8400-e29b-41d4-a716-446655440001',
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'It''s easy to start in India, very hard to scale in India.',
  'ANANTH NARAYANAN',
  '00:11:06',
  666,
  'Low entry barriers create noise; operational complexity kills scale.',
  'from-[#1a1a1a] to-[#252525]',
  1
) ON CONFLICT DO NOTHING;

-- Quote 2
INSERT INTO quotes (id, episode_id, podcast_id, quote_text, author, timestamp, timestamp_seconds, description, gradient, order_index)
VALUES (
  '750e8400-e29b-41d4-a716-446655440002',
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'The best consumer brands are built on deep customer obsession, not just marketing spend.',
  'ANANTH NARAYANAN',
  '00:23:45',
  1425,
  'Understanding your customer''s pain points is more valuable than any advertising budget.',
  'from-[#1a1a2a] to-[#252535]',
  2
) ON CONFLICT DO NOTHING;

-- Quote 3
INSERT INTO quotes (id, episode_id, podcast_id, quote_text, author, timestamp, timestamp_seconds, description, gradient, order_index)
VALUES (
  '750e8400-e29b-41d4-a716-446655440003',
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'Unit economics must work from day one. You can''t scale your way out of a broken model.',
  'ANANTH NARAYANAN',
  '00:34:12',
  2052,
  'Profitability at the unit level is non-negotiable for sustainable growth.',
  'from-[#1a1a1a] to-[#2a2520]',
  3
) ON CONFLICT DO NOTHING;

-- Quote 4
INSERT INTO quotes (id, episode_id, podcast_id, quote_text, author, timestamp, timestamp_seconds, description, gradient, order_index)
VALUES (
  '750e8400-e29b-41d4-a716-446655440004',
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'Distribution is everything. The best product means nothing if it doesn''t reach the customer.',
  'ANANTH NARAYANAN',
  '00:45:30',
  2730,
  'Multi-channel distribution strategy is key to capturing market share.',
  'from-[#1a201a] to-[#252a25]',
  4
) ON CONFLICT DO NOTHING;

-- Quote 5
INSERT INTO quotes (id, episode_id, podcast_id, quote_text, author, timestamp, timestamp_seconds, description, gradient, order_index)
VALUES (
  '750e8400-e29b-41d4-a716-446655440005',
  '650e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'Brand building is a long game. Performance marketing gives you quick wins but not loyalty.',
  'ANANTH NARAYANAN',
  '00:56:18',
  3378,
  'Transitioning from performance to brand marketing at the right time is critical.',
  'from-[#1a1a1a] to-[#2a2020]',
  5
) ON CONFLICT DO NOTHING;