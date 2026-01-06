# Spotify Podcast Player Integration Guide

## Overview
The application includes a sticky podcast player that integrates with Spotify podcast episodes. The player remains fixed at the bottom of the screen and persists across page navigation.

## Architecture

### Components
1. **SpotifyPlayerContext** (`src/contexts/SpotifyPlayerContext.tsx`)
   - Manages global player state
   - Handles play/pause, episode switching, and player visibility

2. **StickyPodcastPlayer** (`src/components/StickyPodcastPlayer/StickyPodcastPlayer.tsx`)
   - UI component for the sticky player
   - Displays episode information and playback controls
   - Uses Spotify's embed iframe for actual audio playback

### Features
- ✅ Sticky positioning at bottom of viewport
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Play/pause controls
- ✅ Skip forward/backward buttons
- ✅ Volume control
- ✅ Episode metadata display (title, number, thumbnail)
- ✅ Progress indicator
- ✅ Close button to dismiss player
- ✅ Smooth slide-in/out animations
- ✅ Context-based state management

## Usage

### Basic Implementation

```tsx
import { useSpotifyPlayer } from './contexts/SpotifyPlayerContext';

function MyComponent() {
  const { setCurrentEpisode } = useSpotifyPlayer();

  const handlePlay = () => {
    setCurrentEpisode({
      spotifyUrl: 'https://open.spotify.com/episode/YOUR_EPISODE_ID',
      title: 'Episode Title',
      episodeNumber: 'Ep 42 • Description',
      thumbnail: '/path/to/thumbnail.jpg' // optional
    });
  };

  return (
    <button onClick={handlePlay}>Play Episode</button>
  );
}
```

### Spotify URL Format
The player accepts Spotify episode URLs in the format:
```
https://open.spotify.com/episode/EPISODE_ID
```

The component automatically extracts the episode ID and creates an embed URL.

### Context API

```tsx
interface SpotifyPlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  setCurrentEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  closePlayer: () => void;
}
```

### Episode Interface

```tsx
interface Episode {
  spotifyUrl: string;        // Required: Full Spotify episode URL
  title: string;             // Required: Episode title
  episodeNumber?: string;    // Optional: Episode number/description
  description?: string;      // Optional: Episode description
  thumbnail?: string;        // Optional: Thumbnail image path
}
```

## Integration Steps

1. **Wrap your app with the provider** (already done in `src/index.tsx`)
```tsx
import { SpotifyPlayerProvider } from './contexts/SpotifyPlayerContext';

<SpotifyPlayerProvider>
  <App />
</SpotifyPlayerProvider>
```

2. **Add the player component** (already done in `src/screens/Frame/Frame.tsx`)
```tsx
import { StickyPodcastPlayer } from './components/StickyPodcastPlayer';

<StickyPodcastPlayer />
```

3. **Trigger playback from any component**
```tsx
const { setCurrentEpisode } = useSpotifyPlayer();

setCurrentEpisode({
  spotifyUrl: 'https://open.spotify.com/episode/...',
  title: 'Your Episode Title',
  episodeNumber: 'Ep 1'
});
```

## Styling & Customization

The player uses your existing design system:
- Dark theme with glassmorphism effect
- Arial font family
- Blue accent color (#2b7fff)
- Responsive breakpoints (mobile: 640px, tablet: 768px, desktop: 1024px)

### CSS Classes
- Background: `bg-[#000000e6]` with backdrop blur
- Border: `border-[#fffefe0d]` for subtle separation
- Text colors: White for primary, `#9e9ea9` for secondary

## Browser Support
- Modern browsers with iframe support
- Spotify embed requires:
  - JavaScript enabled
  - Cookies enabled
  - Modern web standards support

## Limitations & Notes

1. **Spotify Embed Limitations**
   - Requires internet connection
   - Subject to Spotify's embed API availability
   - Some episodes may have playback restrictions

2. **Mobile Considerations**
   - Touch-friendly button sizes (minimum 40x40px)
   - Optimized layout for small screens
   - Time display hidden on mobile to save space

3. **Performance**
   - Iframe is hidden but loaded for audio playback
   - Player only renders when an episode is active
   - Smooth animations using CSS transitions

## Example: Adding Play Buttons

```tsx
// In your component
const episodes = [
  {
    id: '1',
    spotifyUrl: 'https://open.spotify.com/episode/ABC123',
    title: 'Episode 1: Getting Started',
    episodeNumber: 'Ep 1'
  },
  // ... more episodes
];

return (
  <div>
    {episodes.map(episode => (
      <button
        key={episode.id}
        onClick={() => setCurrentEpisode(episode)}
      >
        Play {episode.title}
      </button>
    ))}
  </div>
);
```

## Troubleshooting

### Player not appearing
- Check that SpotifyPlayerProvider wraps your app
- Verify episode URL format is correct
- Check browser console for errors

### Audio not playing
- Verify Spotify episode ID is valid
- Check network tab for embed iframe loading
- Ensure cookies and JavaScript are enabled

### Styling issues
- Check Tailwind CSS is properly configured
- Verify custom font families are loaded
- Test responsive breakpoints in DevTools

## Future Enhancements
- [ ] Volume slider control
- [ ] Playback speed adjustment
- [ ] Real-time progress tracking
- [ ] Keyboard shortcuts
- [ ] Playlist support
- [ ] Share episode functionality
- [ ] Save progress to Supabase
- [ ] Episode queue management
