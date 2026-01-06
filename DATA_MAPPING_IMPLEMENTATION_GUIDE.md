# Data Mapping Implementation Guide

## Overview

This guide provides a complete reference for implementing the pixel-perfect data mapping between the database schema and frontend UI components. The implementation includes database schema, TypeScript types, services, hooks, and component wiring examples.

---

## ✅ PHASE 1: DATABASE SCHEMA (COMPLETED)

### Tables Created

#### **1. guests**
```sql
CREATE TABLE guests (
  id uuid PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at timestamptz,
  updated_at timestamptz
);
```

#### **2. episode_guests** (Junction Table)
```sql
CREATE TABLE episode_guests (
  id uuid PRIMARY KEY,
  episode_id uuid REFERENCES episodes(id),
  guest_id uuid REFERENCES guests(id),
  guest_tag TEXT,              -- Custom badge (e.g., "The OG of Retail")
  display_order INTEGER,
  created_at timestamptz,
  UNIQUE(episode_id, guest_id)
);
```

#### **3. episode_insights** (Universal Content Table)
```sql
CREATE TABLE episode_insights (
  id uuid PRIMARY KEY,
  episode_id uuid REFERENCES episodes(id),
  type TEXT NOT NULL,          -- Insight type enum
  title TEXT,                  -- Headlines/labels
  content TEXT,                -- Main body content
  context TEXT,                -- Subtitles/footer text
  metric_value TEXT,           -- Numeric displays
  metric_unit TEXT,            -- Unit labels
  trend_direction TEXT,        -- Metric arrows
  speaker TEXT,                -- Speaker name
  timestamp_start TEXT,        -- Time pills (HH:MM:SS)
  timestamp_seconds INTEGER,   -- Seeking position
  signal TEXT,                 -- Chapter signals
  action_item TEXT,            -- Chapter next steps
  category_tag TEXT,           -- Chapter category
  display_order INTEGER,
  metadata JSONB,
  created_at timestamptz,
  updated_at timestamptz
);
```

#### **4. episodes** (Extended)
```sql
ALTER TABLE episodes ADD COLUMN framing TEXT;  -- Descriptive paragraph
```

### Insight Types
- `tldr_summary` - AI-generated summary points
- `metric` - Key performance indicators
- `roadmap_item` - Playbook/timeline items
- `quote` - Voice of authority quotes
- `tactical_advice` - Dos and Don'ts
- `chapter` - Knowledge chapter cards
- `video_chapter` - Episode navigation

---

## ✅ PHASE 2: TYPESCRIPT TYPES (COMPLETED)

Location: `src/types/database.ts`

### Key Types
```typescript
export type InsightType =
  | 'tldr_summary'
  | 'metric'
  | 'roadmap_item'
  | 'quote'
  | 'tactical_advice'
  | 'chapter'
  | 'video_chapter';

export interface GuestWithTag {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  guest_tag: string | null
  display_order: number
}

export interface EpisodeWithDetails extends Episode {
  podcast_name?: string
  podcast_slug?: string
  guests?: GuestWithTag[]
  insights?: EpisodeInsight[]
}
```

---

## ✅ PHASE 3: SERVICES & HOOKS (COMPLETED)

### PodcastService Methods (src/services/podcast.service.ts)

```typescript
// Get episode with all related data
PodcastService.getEpisodeWithDetails(episodeId: string)

// Get insights filtered by type
PodcastService.getInsightsByType(episodeId: string, type: InsightType)

// Get guests for an episode
PodcastService.getEpisodeGuests(episodeId: string)

// Create methods
PodcastService.createGuest(guest)
PodcastService.linkGuestToEpisode(episodeId, guestId, guestTag, displayOrder)
PodcastService.createInsight(insight)
PodcastService.createInsights(insights[])
```

### React Hooks (src/hooks/usePodcastData.ts)

```typescript
// Get complete episode data
useEpisodeWithDetails(episodeId: string | null)

// Get insights by type
useInsightsByType(episodeId: string | null, type: InsightType | null)

// Get episode guests
useEpisodeGuests(episodeId: string | null)
```

---

## 🔄 PHASE 4: COMPONENT WIRING (READY TO IMPLEMENT)

### SECTION 1: Hero Header

**Location:** `src/screens/Frame/sections/HeroSection/HeroSection.tsx`

**Data Requirements:**
- Episode number, title, framing
- Guests with custom tags
- TLDR summary points

**Implementation Example:**
```typescript
import { useEpisodeWithDetails, useInsightsByType } from '../../../../hooks/usePodcastData';
import { currentEpisodeId } from '../../../../data/episodes';

export const HeroSection = (): JSX.Element => {
  // Fetch episode data
  const { data: episode } = useEpisodeWithDetails(currentEpisodeId);
  const { data: summaryPoints } = useInsightsByType(currentEpisodeId, 'tldr_summary');

  // Map guests to UI format
  const experts = episode?.guests?.map(guest => ({
    initials: guest.name.split(' ').map(n => n[0]).join(''),
    name: guest.name,
    title: guest.guest_tag || '',
    bgColor: 'bg-blue-500', // Could be in metadata
  })) || hardcodedExperts;

  // Map summary points
  const summaryText = summaryPoints?.map(p => p.content) || hardcodedSummary;

  return (
    <section>
      {/* Episode Badge */}
      <Badge>EPISODE {episode?.episode_number}</Badge>

      {/* Title */}
      <h1>{episode?.title}</h1>

      {/* Framing */}
      <p>{episode?.framing}</p>

      {/* Guests */}
      <GuestAvatarStack guests={experts} />

      {/* AI Summary */}
      {summaryText.map(point => (
        <p key={point}>{point}</p>
      ))}
    </section>
  );
};
```

**Database Mapping:**
- `episodes.episode_number` → Blue episode badge
- `episodes.title` → Main headline
- `episodes.framing` → Descriptive paragraph
- `episode_guests.guest_tag` → Guest badge below name
- `episode_insights[type='tldr_summary'].content` → Bullet points

---

### SECTION 2: Market Signals

**Location:** `src/screens/Frame/sections/MarketSignalsSection/MarketSignalsSection.tsx`

**Data Requirements:**
- Metrics with values, units, and descriptions

**Implementation Example:**
```typescript
const { data: metrics } = useInsightsByType(currentEpisodeId, 'metric');

const phases = metrics?.map(metric => ({
  range: metric.title,           // "30M"
  category: metric.category_tag, // "TARGET MARKET"
  value: metric.metric_value,    // "30"
  unit: metric.metric_unit,      // "M households"
  description: metric.content,   // Full description
})) || hardcodedPhases;
```

**Database Mapping:**
- `title` → Blue metric label / Phase range
- `metric_value` → Large white number
- `metric_unit` → Grey unit subtext
- `content` → Metric description
- `category_tag` → Phase category label

---

### SECTION 3: The Playbook (Timeline)

**Location:** `src/screens/Frame/sections/PlaybookSection/PlaybookSection.tsx`

**Data Requirements:**
- Roadmap items grouped by phase

**Implementation Example:**
```typescript
const { data: roadmapItems } = useInsightsByType(currentEpisodeId, 'roadmap_item');

// Group by phase title
const phasesMap = roadmapItems?.reduce((acc, item) => {
  const phase = item.title; // "0 — 20 Cr"
  if (!acc[phase]) {
    acc[phase] = {
      range: phase,
      category: item.context, // "PRODUCT & COMMUNITY"
      points: []
    };
  }
  acc[phase].points.push(item.content);
  return acc;
}, {}) || {};

const phases = Object.values(phasesMap);
```

**Database Mapping:**
- `title` → Phase header (e.g., "0 — 20 Cr")
- `context` → Phase subtitle (e.g., "PRODUCT & COMMUNITY")
- `content` → Checklist items
- Group by `title` for phase organization

---

### SECTION 4: Voice of Authority (Quotes)

**Location:** `src/screens/Frame/sections/VoiceOfAuthoritySection/VoiceOfAuthoritySection.tsx`

**Data Requirements:**
- Quotes with speaker, timestamp, and context

**Implementation Example:**
```typescript
const { data: quotes } = useInsightsByType(currentEpisodeId, 'quote');

const quotesData = quotes?.map(quote => ({
  text: quote.content,           // Quote text
  author: quote.speaker,         // Speaker name
  timestamp: quote.timestamp_start, // "00:52:42"
  context: quote.context,        // Footer text
  gradient: quote.metadata?.gradient || 'default'
})) || hardcodedQuotes;
```

**Database Mapping:**
- `content` → Quote text
- `speaker` → Author name
- `timestamp_start` → Time pill
- `context` → Footer text
- `metadata.gradient` → Background gradient

---

### SECTION 5: Dos and Don'ts

**Location:** `src/screens/Frame/sections/DosAndDontsSection/DosAndDontsSection.tsx`

**Data Requirements:**
- Tactical advice separated by DO/DON'T type

**Implementation Example:**
```typescript
const { data: tacticalAdvice } = useInsightsByType(currentEpisodeId, 'tactical_advice');

const dosAndDonts = {
  dos: tacticalAdvice?.filter(item => item.context === 'DO').map(item => ({
    title: item.title,
    description: item.content
  })) || hardcodedDos,

  donts: tacticalAdvice?.filter(item => item.context === 'DONT').map(item => ({
    title: item.title,
    description: item.content
  })) || hardcodedDonts
};
```

**Database Mapping:**
- `title` → Advice headline
- `content` → Advice description
- `context` → 'DO' (green column) vs 'DONT' (red column)

---

### SECTION 6: Knowledge Chapters

**Location:** `src/screens/Frame/sections/KnowledgeChaptersSection/KnowledgeChaptersSection.tsx`

**Data Requirements:**
- Chapter cards with category, timestamp, context, signal, and action items

**Implementation Example:**
```typescript
const { data: chapters } = useInsightsByType(currentEpisodeId, 'chapter');

const chaptersData = chapters?.map(chapter => ({
  categoryTag: chapter.category_tag,    // "MARKET STRATEGY"
  timestamp: chapter.timestamp_start,    // "00:52:42"
  title: chapter.title,                  // "The 'India 1' Theory"
  context: chapter.content,              // CONTEXT block
  signal: chapter.signal,                // SIGNAL block
  nextStep: chapter.action_item,         // NEXT STEP block
  speaker: chapter.speaker,              // Footer speaker name
})) || hardcodedChapters;
```

**Database Mapping:**
- `category_tag` → Blue category pill (top-left)
- `timestamp_start` → Time pill (top-right)
- `title` → Card headline
- `content` → "CONTEXT" block
- `signal` → "SIGNAL" block
- `action_item` → "NEXT STEP" block
- `speaker` → Footer speaker name

---

### SECTION 7: Episode Chapters (Navigation)

**Location:** `src/components/EpisodesCalendar/CalendarView.tsx` or similar

**Data Requirements:**
- Video chapter navigation points

**Implementation Example:**
```typescript
const { data: videoChapters } = useInsightsByType(currentEpisodeId, 'video_chapter');

const chapters = videoChapters?.map(chapter => ({
  timestamp: chapter.timestamp_start,     // "05:30"
  timeInSeconds: chapter.timestamp_seconds, // 330
  title: chapter.title,                   // "The 0-20 Cr Phase"
  description: chapter.content            // Chapter description
})) || hardcodedChapters;
```

**Database Mapping:**
- `timestamp_start` → Blue time link
- `timestamp_seconds` → Seeking position
- `title` → White chapter headline
- `content` → Grey chapter description

---

## 📝 DATA SEEDING EXAMPLES

### Example: Seed Complete Episode

```typescript
import { PodcastService } from './services/podcast.service';

async function seedEpisodeData(episodeId: string) {
  // 1. Create guests
  const kishore = await PodcastService.createGuest({
    name: 'Kishore Biyani',
    bio: 'Founder of Future Group and pioneer of modern retail in India'
  });

  const ananth = await PodcastService.createGuest({
    name: 'Ananth Narayanan',
    bio: 'Former CEO of Myntra, scaling expert'
  });

  // 2. Link guests to episode
  await PodcastService.linkGuestToEpisode(
    episodeId,
    kishore.id,
    'The OG of Retail',
    0
  );

  await PodcastService.linkGuestToEpisode(
    episodeId,
    ananth.id,
    'Scale Operator',
    1
  );

  // 3. Create TLDR summary
  await PodcastService.createInsights([
    {
      episode_id: episodeId,
      type: 'tldr_summary',
      content: "The 'India 1' Thesis: Only ~30M households (120M people) drive 60-70% of all value-added consumption.",
      display_order: 0
    },
    {
      episode_id: episodeId,
      type: 'tldr_summary',
      content: "The 0-20-100 Rule: 0-20Cr is built on Product & Community. 20-100Cr is Performance Marketing. 100Cr+ requires Offline.",
      display_order: 1
    }
  ]);

  // 4. Create market signals (metrics)
  await PodcastService.createInsight({
    episode_id: episodeId,
    type: 'metric',
    title: '30M',
    metric_value: '30',
    metric_unit: 'M households',
    content: 'Target market size that drives majority of consumption',
    category_tag: 'TARGET MARKET',
    display_order: 0
  });

  // 5. Create roadmap items
  await PodcastService.createInsights([
    {
      episode_id: episodeId,
      type: 'roadmap_item',
      title: '0 — 20 Cr',
      context: 'PRODUCT & COMMUNITY',
      content: "Target a 'Micro-Niche' (e.g., Toilet Seat Sprays, Pet Accessories)",
      display_order: 0
    },
    {
      episode_id: episodeId,
      type: 'roadmap_item',
      title: '0 — 20 Cr',
      context: 'PRODUCT & COMMUNITY',
      content: "Maintain 80% Marketplace / 20% D2C mix for cash flow",
      display_order: 1
    }
  ]);

  // 6. Create quotes
  await PodcastService.createInsight({
    episode_id: episodeId,
    type: 'quote',
    content: "Don't get fooled by the 1.4 Billion population number. Real purchasing power is concentrated.",
    speaker: 'Kishore Biyani',
    timestamp_start: '00:52:42',
    timestamp_seconds: 3162,
    context: 'On understanding the Indian consumer market',
    display_order: 0
  });

  // 7. Create tactical advice
  await PodcastService.createInsights([
    {
      episode_id: episodeId,
      type: 'tactical_advice',
      title: 'Focus on India 1 Demographic',
      content: 'Target the top 30M households that drive 60-70% of consumption value.',
      context: 'DO',
      display_order: 0
    },
    {
      episode_id: episodeId,
      type: 'tactical_advice',
      title: "Don't Use Performance Marketing Too Early",
      content: 'Burning cash on ads before PMF artificially inflates growth and destroys unit economics.',
      context: 'DONT',
      display_order: 0
    }
  ]);

  // 8. Create knowledge chapters
  await PodcastService.createInsight({
    episode_id: episodeId,
    type: 'chapter',
    category_tag: 'MARKET STRATEGY',
    timestamp_start: '00:52:42',
    timestamp_seconds: 3162,
    title: "The 'India 1' Theory",
    content: "Don't get fooled by the 1.4 Billion population number. Real purchasing power is concentrated.",
    signal: "30M households (Singapore/Poland/Mexico equivalents) drive 60-70% of value-added consumption.",
    action_item: "Target the top 100M. Ignore the rest for premium brand building.",
    speaker: 'Kishore Biyani',
    display_order: 0
  });

  // 9. Create video chapters
  await PodcastService.createInsights([
    {
      episode_id: episodeId,
      type: 'video_chapter',
      timestamp_start: '00:00',
      timestamp_seconds: 0,
      title: 'Introduction to Consumer Brands',
      content: 'Overview of the Indian consumer market and key growth drivers',
      display_order: 0
    },
    {
      episode_id: episodeId,
      type: 'video_chapter',
      timestamp_start: '05:30',
      timestamp_seconds: 330,
      title: 'The 0-20 Cr Phase',
      content: 'Product-market fit and building initial community traction',
      display_order: 1
    }
  ]);

  console.log('Episode data seeded successfully!');
}
```

---

## 🔧 UTILITY FUNCTIONS

### Data Transformer Utilities

Create `src/lib/data-transformers.ts`:

```typescript
import type { EpisodeInsight, GuestWithTag } from '../types/database';

export const transformGuestsToAvatarStack = (guests: GuestWithTag[]) => {
  return guests.map((guest, index) => ({
    initials: guest.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    name: guest.name,
    title: guest.guest_tag || '',
    bgColor: getBgColorForIndex(index),
  }));
};

export const groupRoadmapByPhase = (items: EpisodeInsight[]) => {
  const phasesMap = items.reduce((acc, item) => {
    const phase = item.title || 'Unknown';
    if (!acc[phase]) {
      acc[phase] = {
        range: phase,
        category: item.context || '',
        points: []
      };
    }
    acc[phase].points.push(item.content || '');
    return acc;
  }, {} as Record<string, any>);

  return Object.values(phasesMap);
};

export const splitTacticalAdvice = (advice: EpisodeInsight[]) => {
  return {
    dos: advice.filter(a => a.context === 'DO'),
    donts: advice.filter(a => a.context === 'DONT')
  };
};

const getBgColorForIndex = (index: number): string => {
  const colors = [
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-zinc-500',
    'bg-purple-500',
    'bg-red-500'
  ];
  return colors[index % colors.length];
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 4 Tasks

- [ ] Wire Hero Section to use `useEpisodeWithDetails` and `useInsightsByType`
- [ ] Wire Market Signals to use metrics insights
- [ ] Wire Playbook Section to use roadmap_item insights
- [ ] Wire Voice of Authority to use quote insights
- [ ] Wire Dos and Don'ts to use tactical_advice insights
- [ ] Wire Knowledge Chapters to use chapter insights
- [ ] Wire Episode Navigation to use video_chapter insights
- [ ] Create data seeding script for initial episode
- [ ] Test all sections with database data
- [ ] Verify fallback to hardcoded data when DB is empty
- [ ] Run final build and visual regression check

---

## 🎯 KEY PRINCIPLES

### 1. Graceful Degradation
Always provide hardcoded fallbacks:
```typescript
const data = dbData || hardcodedData;
```

### 2. Loading States
Handle loading and error states:
```typescript
const { data, loading, error } = useEpisodeWithDetails(episodeId);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
if (!data) return <HardcodedContent />;
```

### 3. Type Safety
Always use TypeScript types from database.ts:
```typescript
import type { EpisodeInsight, GuestWithTag } from '../types/database';
```

### 4. Display Order
Respect `display_order` for consistent sequencing:
```typescript
.order('display_order', { ascending: true })
```

### 5. Null Safety
Check for null values before rendering:
```typescript
{episode?.title && <h1>{episode.title}</h1>}
```

---

## 📊 DATABASE QUERY EXAMPLES

### Get All Data for Current Episode
```typescript
const episode = await PodcastService.getEpisodeWithDetails(currentEpisodeId);
// Returns: { ...episode, guests: [...], insights: [...] }
```

### Get Specific Insight Type
```typescript
const summaryPoints = await PodcastService.getInsightsByType(
  currentEpisodeId,
  'tldr_summary'
);
```

### Get Guests with Tags
```typescript
const guests = await PodcastService.getEpisodeGuests(currentEpisodeId);
// Returns: [{ id, name, avatar_url, bio, guest_tag, display_order }]
```

---

## 🚀 NEXT STEPS

1. **Choose a section to implement** (recommend starting with Hero Section)
2. **Add the hook to fetch data** (`useEpisodeWithDetails`, `useInsightsByType`, etc.)
3. **Map the data to UI format** (use transformer utilities if needed)
4. **Add fallback to hardcoded data** (for when DB is empty)
5. **Test the section** (verify it renders correctly)
6. **Repeat for remaining sections**

---

## 📚 ADDITIONAL RESOURCES

- **Database Schema:** `supabase/migrations/20251230080000_extend_schema_for_detailed_content.sql`
- **TypeScript Types:** `src/types/database.ts`
- **Services:** `src/services/podcast.service.ts`
- **Hooks:** `src/hooks/usePodcastData.ts`
- **Component Examples:** See individual section implementations above

---

## ⚠️ IMPORTANT NOTES

1. **Zero Visual Regression:** All existing hardcoded data remains as fallbacks
2. **CSS Unchanged:** No styling modifications were made
3. **Type Safety:** All data mappings are type-safe
4. **RLS Security:** All tables have proper Row Level Security policies
5. **Scalability:** Schema supports multiple episodes and podcasts

---

**Implementation Status:**
- ✅ Database Schema Extended
- ✅ TypeScript Types Updated
- ✅ Services Created
- ✅ Hooks Implemented
- ⏳ Component Wiring (Ready for Implementation)
- ⏳ Data Seeding (Ready for Implementation)
