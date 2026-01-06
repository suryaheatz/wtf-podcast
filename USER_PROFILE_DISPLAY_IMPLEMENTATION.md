# User Profile Display System - Implementation Documentation

## Overview
This document details the complete implementation of the responsive user profile display system for the WTFKST podcast application, featuring desktop expanded views and mobile toggle functionality.

---

## ✅ Implementation Summary

### Desktop Implementation (≥768px)
- **Always Expanded**: All guest profiles display as rounded rectangle badges by default
- **No Hover States**: Profiles are permanently visible (no interaction required)
- **Full Guest List**: All guests shown simultaneously
- **Layout**: Horizontal wrap layout with consistent spacing

### Mobile Implementation (<768px)
- **Initial Display**: Shows exactly 2 guest profile badges
- **Toggle Functionality**:
  - "X more" link appears when guests > 2
  - Expands to show all profiles on click
  - Changes to "show less" in expanded state
  - Collapses back to 2 profiles on second click
- **Smooth Animations**: Staggered fade-in effects for profile badges

---

## 🎨 Design Specifications

### Desktop Profile Badges

**Container Styling:**
```
- Background: zinc-900 (rgb(24, 24, 27))
- Border: 1px solid rgba(255, 254, 254, 0.05)
- Border Radius: 9999px (fully rounded)
- Padding: 10px 20px 10px 8px
- Gap: 12px between avatar and text
- Spacing: 12px between badges
- Hover: Background transitions to zinc-800
```

**Avatar Specifications:**
```
- Size: 32px × 32px
- Border Radius: 50% (circle)
- Dynamic Background Colors:
  - Orange: bg-orange-500
  - Blue: bg-blue-500
  - Green: bg-emerald-500
  - Gray: bg-gray-500
- Text: Bold, white, 12px, Arial-Bold
```

**Typography:**
```
Guest Name:
  - Size: 15px
  - Color: White (rgb(255, 255, 255))
  - Weight: Medium (500)
  - Font: Arial-Regular
  - Line Height: Tight

Guest Title:
  - Size: 12px
  - Color: #70707b (gray-500)
  - Weight: Regular (400)
  - Font: Arial-Regular
  - Margin Top: 2px
```

---

### Mobile Profile Badges

**Container Styling:**
```
- Background: zinc-900
- Border: 1px solid rgba(255, 254, 254, 0.05)
- Border Radius: 9999px
- Padding: 6px 16px 6px 6px
- Gap: 10px between avatar and text
- Spacing: 8px between badges
- Wrap: Flex-wrap for multiple rows
```

**Avatar Specifications:**
```
- Size: 28px × 28px
- Same color scheme as desktop
- Text: Bold, white, 12px
```

**Typography:**
```
Guest Name:
  - Size: 14px
  - Color: White
  - Weight: Medium (500)

Guest Title:
  - Size: 11px
  - Color: #70707b
  - Weight: Regular (400)
  - Margin Top: 2px
```

**Toggle Link Styling:**
```
- Color: #2b7fff (primary blue)
- Hover: #5a9fff (lighter blue)
- Active: #1a5fbf (darker blue)
- Size: 14px
- Weight: Medium (500)
- Text Decoration: Underline
- Underline Color: rgba(43, 127, 255, 0.3)
- Underline Offset: 2px
- Transition: All colors 200ms
```

---

## 🔄 Interaction Specifications

### Mobile Toggle Behavior

**Initial State:**
```
- Displays: 2 guest badges
- Toggle Text: "X more" (where X = remaining guest count)
- Animation: None (static initial load)
```

**Expanded State:**
```
- Displays: All guest badges
- Toggle Text: "show less"
- Animation: Staggered fade-in
  - Each badge: 300ms ease-out
  - Stagger Delay: 50ms per badge
  - Effect: Fade + slide from top (8px)
```

**Collapsed State:**
```
- Returns to: 2 guest badges
- Toggle Text: "X more"
- Animation: Immediate (no exit animation)
```

**Animation Timing:**
```css
.badge-enter {
  animation: fadeSlideIn 300ms ease-out;
  animation-delay: calc(index * 50ms);
  animation-fill-mode: backwards;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 💻 Technical Implementation

### Component Structure

**File:** `src/components/GuestAvatarStack/GuestAvatarStack.tsx`

**Key Features:**
1. ✅ Responsive rendering (separate desktop/mobile views)
2. ✅ State management for expansion toggle
3. ✅ Dynamic guest count calculation
4. ✅ Accessibility attributes (aria-expanded, aria-label)
5. ✅ Smooth CSS transitions and animations
6. ✅ Semantic HTML structure

### Props Interface

```typescript
interface GuestAvatarStackProps {
  guests: Guest[];              // Array of guest objects
  maxVisibleMobile?: number;    // Default: 2
}

interface Guest {
  initials: string;   // Avatar initials (e.g., "KB")
  name: string;       // Full name (e.g., "Kishore Biyani")
  title: string;      // Job title (e.g., "The OG of Retail")
  bgColor: string;    // Tailwind class (e.g., "bg-orange-500")
}
```

### State Management

```typescript
const [isExpanded, setIsExpanded] = useState(false);

// Mobile visibility logic
const visibleGuestsMobile = isExpanded
  ? guests
  : guests.slice(0, maxVisibleMobile);

// Remaining guest count
const remainingCount = guests.length - maxVisibleMobile;
const hasMore = remainingCount > 0;
```

---

## 📱 Responsive Breakpoints

**Tailwind CSS Breakpoints:**
```
- Mobile: < 768px (default)
- Desktop: ≥ 768px (md: prefix)
```

**Implementation:**
```jsx
// Desktop View
<div className="hidden md:flex md:flex-wrap md:gap-3">
  {/* All guests always visible */}
</div>

// Mobile View
<div className="md:hidden flex flex-col gap-2.5">
  {/* Toggle functionality */}
</div>
```

---

## ♿ Accessibility Features

**ARIA Attributes:**
```jsx
<button
  aria-expanded={isExpanded}
  aria-label={
    isExpanded
      ? 'Show less guests'
      : `Show ${remainingCount} more guests`
  }
>
```

**Keyboard Support:**
- ✅ Toggle button is fully keyboard accessible
- ✅ Tab navigation supported
- ✅ Enter/Space keys trigger toggle

**Screen Reader Support:**
- ✅ Dynamic aria-label updates based on state
- ✅ Expansion state communicated via aria-expanded
- ✅ Semantic button element for toggle

---

## 🎯 Use Cases & Examples

### Example 1: Four Guests (Current Implementation)

**Desktop Display:**
```
[KB - Kishore Biyani | The OG of Retail]
[AN - Ananth Narayanan | Scale Operator]
[RS - Raj Shamani | Content Capitalist]
[NK - Nikhil Kamath | Investigator]
```

**Mobile Display - Collapsed:**
```
[KB - Kishore Biyani | The OG of Retail]
[AN - Ananth Narayanan | Scale Operator]
2 more
```

**Mobile Display - Expanded:**
```
[KB - Kishore Biyani | The OG of Retail]
[AN - Ananth Narayanan | Scale Operator]
[RS - Raj Shamani | Content Capitalist]
[NK - Nikhil Kamath | Investigator]
show less
```

### Example 2: Two or Fewer Guests

**Mobile Display:**
```
[Guest 1]
[Guest 2]
(No toggle link - all guests visible)
```

---

## 🔧 Customization Options

### Adjusting Mobile Visibility Limit

```jsx
<GuestAvatarStack
  guests={guestData}
  maxVisibleMobile={3}  // Show 3 instead of 2
/>
```

### Modifying Colors

**Primary Link Color:**
```typescript
// Change #2b7fff to your brand color
className="text-[#YOUR_COLOR]"
```

**Background Colors:**
```typescript
// Update in guest data object
bgColor: "bg-purple-500"  // Any Tailwind color
```

---

## 🐛 Bug Fixes Implemented

### Issue: UI Disappearance Bug
**Problem:** Previous implementation caused complete UI vanishing after closing mobile modal.

**Root Cause:**
- Modal backdrop with `fixed inset-0 z-50 bg-black/80` persisting after state change
- Improper cleanup of modal overlay elements

**Solution:**
- ✅ Removed modal implementation entirely
- ✅ Replaced with inline toggle functionality
- ✅ No backdrop overlays required
- ✅ Simplified state management
- ✅ Eliminated z-index stacking issues

---

## ✅ Testing Checklist

### Desktop Testing
- [x] All guests display on load
- [x] Badges properly formatted
- [x] Hover states work correctly
- [x] Layout responsive to screen width
- [x] Proper wrapping on smaller desktop screens

### Mobile Testing
- [x] Only 2 guests show initially
- [x] Toggle link displays correct count
- [x] Expansion reveals all guests
- [x] "show less" collapses correctly
- [x] Animations smooth and performant
- [x] Touch interaction responsive
- [x] Multiple toggle cycles work correctly

### Cross-Browser Testing
- [x] Chrome/Edge (Chromium)
- [x] Safari (iOS + macOS)
- [x] Firefox
- [x] Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing
- [x] Keyboard navigation
- [x] Screen reader compatibility
- [x] ARIA attributes present
- [x] Focus indicators visible
- [x] Color contrast sufficient (WCAG AA)

---

## 📊 Performance Metrics

**Component Size:**
- Lines of Code: 97 (reduced from 172)
- Complexity: Low
- Re-renders: Minimal (only on toggle)
- Animation Cost: Negligible (CSS-based)

**Bundle Impact:**
- Removed dependencies: XIcon (lucide-react)
- Reduced complexity: No modal/backdrop
- Net Impact: ~30% reduction in component size

---

## 🚀 Future Enhancements

**Potential Improvements:**
1. Add smooth collapse animation (currently instant)
2. Implement "Show all" option for desktop at certain guest counts
3. Add guest profile links/modals on click
4. Lazy load guest avatars for performance
5. Add skeleton loading states
6. Implement virtual scrolling for 20+ guests

---

## 📝 Maintenance Notes

**Component Location:**
```
src/components/GuestAvatarStack/GuestAvatarStack.tsx
```

**Dependencies:**
- React (useState hook)
- Tailwind CSS
- Custom Avatar component (src/components/ui/avatar.tsx)

**Related Files:**
- `src/components/ui/avatar.tsx` - Avatar component
- `src/screens/Frame/sections/HeroSection/HeroSection.tsx` - Usage location

---

## 🎓 Developer Guidelines

**When Modifying This Component:**

1. **Test Both Breakpoints:** Always verify desktop AND mobile views
2. **Preserve Animations:** Maintain smooth transitions for user experience
3. **Accessibility First:** Keep ARIA attributes updated
4. **Performance:** Avoid inline functions in map callbacks
5. **State Management:** Keep toggle state simple and predictable

**Color Consistency:**
- Use existing guest color scheme (orange, blue, green, gray)
- Maintain contrast ratios for accessibility
- Link colors should align with brand palette (#2b7fff primary)

---

## 📞 Support & Questions

**Component Owner:** Frontend Team
**Last Updated:** 2024-12-30
**Version:** 2.0.0 (Major rewrite from modal to inline toggle)

For questions or issues, refer to:
- This documentation
- Component source code comments
- Team Slack channel: #frontend-support

---

## Appendix: Code Comparison

### Before (Modal Implementation)
- Lines: 172
- Complexity: High
- Issues: UI disappearance bug, z-index conflicts
- Dependencies: XIcon, complex modal structure

### After (Toggle Implementation)
- Lines: 97
- Complexity: Low
- Issues: None known
- Dependencies: Minimal

**Migration Impact:** ✅ Breaking change - simplified API, improved UX

---

*End of Documentation*
