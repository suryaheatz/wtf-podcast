# Swipeable Card Stack - Implementation Guide

## Overview

A fully responsive, accessible swipeable card stack component with smooth animations and touch/mouse gesture support. Built with React, TypeScript, and Tailwind CSS.

---

## Features

### ✨ **Core Functionality**
- **Stacked Card Layout** - Cards positioned with depth effect (3 visible cards)
- **Smooth Swipe Gestures** - Touch on mobile, drag on desktop
- **Keyboard Navigation** - Arrow keys for accessibility
- **Auto-Play Mode** - Optional automatic card rotation
- **Dot Navigation** - Click/tap dots to jump to specific cards
- **Visual Indicators** - Clear feedback for interactive elements

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes (320px - 2560px+)
- Touch-optimized hit targets
- Adaptive typography and spacing

### ⚡ **Performance**
- 60fps animations using CSS transforms
- Hardware acceleration with `translateZ(0)`
- `will-change` optimization
- No layout reflows during animation

### ♿ **Accessibility**
- ARIA labels and live regions
- Keyboard navigation support
- Screen reader announcements
- Focus management

---

## Component Architecture

```
SwipeableCardStack/
├── SwipeableCardStack.tsx    # Main container component
└── index.ts                   # Export file

QuoteCard/
├── QuoteCard.tsx              # Individual card component
└── index.ts                   # Export file
```

---

## How It Works

### 1. **Card Stacking Logic**

The stack displays 3 cards simultaneously with decreasing scale and opacity:

```typescript
Position 0 (Current):
- transform: scale(1)
- opacity: 1
- zIndex: 30

Position 1 (Next):
- transform: scale(0.95)
- opacity: 0.7
- zIndex: 20

Position 2 (After Next):
- transform: scale(0.9)
- opacity: 0.4
- zIndex: 10
```

### 2. **Swipe Gesture Detection**

#### **Touch Events (Mobile)**
```typescript
handleTouchStart → Record starting X position
handleTouchMove  → Calculate drag offset
handleTouchEnd   → Determine swipe direction
```

#### **Mouse Events (Desktop)**
```typescript
handleMouseDown → Enable dragging mode
handleMouseMove → Update drag offset (if dragging)
handleMouseUp   → Evaluate threshold and navigate
```

#### **Swipe Threshold**
- **100px drag** = Trigger card change
- **< 100px drag** = Return to original position

### 3. **Animation System**

#### **CSS Transitions**
```css
transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

- **Easing Function**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy feel)
- **Duration**: 400ms for smooth motion
- **Properties**: transform, opacity

#### **Transform Chain**
```typescript
transform: translateX(offset) scale(size) translateZ(0)
```

- `translateX` - Horizontal movement
- `scale` - Size changes for depth
- `translateZ(0)` - Hardware acceleration

### 4. **Drag Parallax Effect**

Cards behind the active card move at reduced speeds:

```typescript
Position 0: dragOffset × 1.0  (full speed)
Position 1: dragOffset × 0.3  (30% speed)
Position 2: dragOffset × 0.15 (15% speed)
```

This creates a natural depth perception.

---

## Usage Examples

### Basic Implementation

```tsx
import { SwipeableCardStack } from "@/components/SwipeableCardStack";
import { QuoteCard } from "@/components/QuoteCard";

<SwipeableCardStack>
  <QuoteCard
    quote="Your quote here"
    author="Author Name"
  />
  <QuoteCard
    quote="Another quote"
    author="Another Author"
  />
</SwipeableCardStack>
```

### With Auto-Play

```tsx
<SwipeableCardStack autoPlayInterval={5000}>
  {cards.map(card => (
    <QuoteCard key={card.id} {...card} />
  ))}
</SwipeableCardStack>
```

### Custom Gradients

```tsx
<QuoteCard
  quote="Your quote"
  author="Author"
  gradient="from-[#1a1a2a] to-[#252535]"
  timestamp="00:15:30"
  description="Additional context"
/>
```

---

## Props API

### SwipeableCardStack

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode[]` | Required | Array of card components |
| `onCardChange` | `(index: number) => void` | - | Callback when card changes |
| `autoPlayInterval` | `number` | 0 | Auto-play interval in ms (0 = disabled) |

### QuoteCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quote` | `string` | Required | Main quote text |
| `author` | `string` | Required | Author name |
| `timestamp` | `string` | - | Optional timestamp |
| `description` | `string` | - | Optional description |
| `gradient` | `string` | `from-[#1a1a1a] to-[#2a2a2a]` | Tailwind gradient classes |

---

## Interaction Methods

### 🖱️ **Desktop**
- **Click & Drag** - Swipe cards left/right
- **Arrow Keys** - Navigate (← previous, → next)
- **Click Dots** - Jump to specific card
- **Auto-Play Button** - Toggle automatic rotation

### 📱 **Mobile**
- **Swipe Gesture** - Touch and drag horizontally
- **Tap Dots** - Jump to specific card
- **Auto-Play Button** - Toggle automatic rotation

### ⌨️ **Keyboard**
- **← Left Arrow** - Previous card
- **→ Right Arrow** - Next card
- **Tab** - Focus navigation dots

---

## Visual Indicators

### **Stack Effect**
```
┌─────────────────┐
│  Active Card    │ ← Full size, full opacity
│  (z-index: 30)  │
├─────────────────┤
│ Next Card (95%) │ ← Slightly scaled, 70% opacity
├─────────────────┤
│ Card 3 (90%)    │ ← More scaled, 40% opacity
└─────────────────┘
```

### **During Drag**
- Active card follows cursor/touch
- Background cards move with parallax
- Cursor changes to `grabbing`

### **Navigation Dots**
- **Active dot**: Blue, elongated (w-8 h-2)
- **Inactive dots**: Gray, circular (w-2 h-2)
- **Hover**: Brighter gray

---

## Performance Optimization

### **Hardware Acceleration**
```css
transform: translateZ(0);        /* Force GPU rendering */
backface-visibility: hidden;     /* Prevent flickering */
will-change: transform, opacity; /* Hint to browser */
```

### **Transition Management**
```typescript
// No transition during drag (instant feedback)
transition: isDragging ? "none" : "transform 0.4s..."

// Smooth transition on release
transition: "transform 0.4s cubic-bezier(...)"
```

### **Event Optimization**
- Passive event listeners for touch
- Throttled mouse move events
- Cleanup on unmount

---

## Accessibility Features

### **ARIA Attributes**
```html
role="region"
aria-label="Swipeable card stack"
aria-live="polite"
aria-hidden={index !== currentIndex}
aria-current={isActive}
```

### **Screen Reader Announcements**
```html
<div className="sr-only" aria-live="polite">
  Card {currentIndex + 1} of {totalCards}
</div>
```

### **Keyboard Support**
- Arrow keys for navigation
- Tab to focus controls
- Enter/Space for buttons

---

## Customization

### **Change Animation Speed**
```tsx
// In SwipeableCardStack.tsx
transition: "transform 0.6s ease-out" // Slower
transition: "transform 0.2s ease-in"  // Faster
```

### **Adjust Swipe Threshold**
```typescript
const threshold = 150; // Requires longer swipe
const threshold = 50;  // More sensitive
```

### **Modify Stack Depth**
```typescript
// Show 4 cards instead of 3
else if (position === 3) {
  return {
    transform: "scale(0.85)",
    opacity: 0.2,
    zIndex: 5,
  };
}
```

### **Custom Card Heights**
```tsx
// In SwipeableCardStack.tsx
<div style={{ minHeight: "600px" }}>
```

---

## Browser Support

✅ **Fully Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

⚠️ **Partial Support:**
- IE 11 (no smooth animations)

---

## File Structure

```
src/
├── components/
│   ├── SwipeableCardStack/
│   │   ├── SwipeableCardStack.tsx   # 250 lines
│   │   └── index.ts
│   └── QuoteCard/
│       ├── QuoteCard.tsx             # 80 lines
│       └── index.ts
├── data/
│   └── quotes.ts                     # Quote data structure
├── screens/Frame/sections/
│   └── VoiceOfAuthoritySection/
│       └── VoiceOfAuthoritySection.tsx
└── tailwind.css                      # Custom animations
```

---

## Technical Details

### **State Management**
```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const [dragOffset, setDragOffset] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const [isAutoPlaying, setIsAutoPlaying] = useState(false);
```

### **Refs Usage**
```typescript
const containerRef = useRef<HTMLDivElement>(null);
const startXRef = useRef(0);
const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
```

### **Effect Hooks**
1. **Card Change Callback** - Notify parent of index change
2. **Auto-Play Timer** - Automatic card rotation
3. **Cleanup** - Clear intervals on unmount

---

## Troubleshooting

### **Cards Not Swiping**
- Check `touch-action: pan-y` is set
- Verify event handlers are attached
- Ensure parent container isn't capturing events

### **Choppy Animations**
- Add `will-change: transform` to cards
- Use `translateZ(0)` for GPU acceleration
- Reduce number of visible stacked cards

### **Touch Conflicts**
- Set `touch-pan-y` on container
- Use `preventDefault()` carefully
- Check for conflicting scroll handlers

---

## Future Enhancements

- [ ] Infinite loop mode
- [ ] Vertical swipe support
- [ ] Custom transition curves per card
- [ ] Swipe velocity detection
- [ ] Spring physics animations
- [ ] Card flip animations
- [ ] Multi-directional swipes (Tinder-style)

---

## Credits

**Technology Stack:**
- React 18.2
- TypeScript
- Tailwind CSS 3.4
- Lucide React (icons)

**Animation Techniques:**
- CSS transforms for performance
- Cubic bezier easing for natural motion
- Parallax effect for depth perception

---

## Support

For questions or issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test in different browsers/devices
4. Review accessibility with screen readers

---

**Built with ❤️ for the WTF KST project**
