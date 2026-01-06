/*
  # Seed Playbook Roadmap Items

  1. Data Population
    - Adds all 3 phases of the "0 to 100 Crore Playbook"
    - Phase 1: 0 — 20 Cr (PRODUCT & COMMUNITY) - 3 items
    - Phase 2: 20 — 50 Cr (MARKETING & BRAND) - 4 items
    - Phase 3: 50 — 100 Cr (SCALE & EFFICIENCY) - 4 items
  
  2. Structure
    - Each item has a title (phase range), context (category), and content (checklist item)
    - display_order ensures proper grouping and sequencing
    - All items are linked to the D2C Brand Building episode
*/

-- Insert Phase 1: 0 — 20 Cr (PRODUCT & COMMUNITY)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Target a ''Micro-Niche'' (e.g., Toilet Seat Sprays, Pet Accessories)', 1),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Maintain 80% Marketplace / 20% D2C mix for cash flow', 2),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '0 — 20 Cr', 'PRODUCT & COMMUNITY', 'Do NOT spend on Performance Marketing yet', 3);

-- Insert Phase 2: 20 — 50 Cr (MARKETING & BRAND)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '20 — 50 Cr', 'MARKETING & BRAND', 'Start building brand awareness through content and influencers', 4),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '20 — 50 Cr', 'MARKETING & BRAND', 'Shift to 50% Marketplace / 50% D2C distribution', 5),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '20 — 50 Cr', 'MARKETING & BRAND', 'Introduce Performance Marketing with strict CAC:LTV ratios', 6),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '20 — 50 Cr', 'MARKETING & BRAND', 'Expand product line within your niche', 7);

-- Insert Phase 3: 50 — 100 Cr (SCALE & EFFICIENCY)
INSERT INTO episode_insights (episode_id, type, title, context, content, display_order) VALUES
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '50 — 100 Cr', 'SCALE & EFFICIENCY', 'Optimize supply chain and unit economics', 8),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '50 — 100 Cr', 'SCALE & EFFICIENCY', 'Build proprietary data and AI capabilities', 9),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '50 — 100 Cr', 'SCALE & EFFICIENCY', 'Scale D2C to 80% of revenue for margin control', 10),
('650e8400-e29b-41d4-a716-446655440008', 'roadmap_item', '50 — 100 Cr', 'SCALE & EFFICIENCY', 'Consider geographic expansion or new verticals', 11);
