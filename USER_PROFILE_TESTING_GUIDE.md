# User Profile Display - Testing & QA Guide

## 🧪 Comprehensive Testing Protocol

---

## 1. Functional Testing

### Desktop Functionality Tests

#### Test Case DT-001: Initial Load
**Objective:** Verify all guest profiles display on page load

**Steps:**
1. Open application on desktop browser (≥768px viewport)
2. Navigate to hero section
3. Observe guest profile badges

**Expected Result:**
- ✅ All 4 guest badges visible immediately
- ✅ No hover required to see profiles
- ✅ Badges properly formatted with avatar + name + title
- ✅ Proper spacing between badges (12px gap)

**Pass Criteria:** All guests visible, no interaction needed

---

#### Test Case DT-002: Badge Layout
**Objective:** Verify badge arrangement and wrapping

**Steps:**
1. Load page at 1440px width
2. Gradually resize to 768px
3. Observe badge wrapping behavior

**Expected Result:**
- ✅ Badges wrap to multiple rows as width decreases
- ✅ Consistent spacing maintained
- ✅ No badge overlap or clipping
- ✅ Clean alignment in wrapped rows

**Pass Criteria:** Responsive wrapping without layout breaks

---

#### Test Case DT-003: Hover Interaction
**Objective:** Verify hover state transitions

**Steps:**
1. Hover mouse over each guest badge
2. Observe background color change
3. Move mouse away and verify return to normal

**Expected Result:**
- ✅ Background changes from zinc-900 to zinc-800
- ✅ Smooth transition (200ms)
- ✅ No text or avatar changes
- ✅ Returns to original state on mouse leave

**Pass Criteria:** Smooth hover feedback on all badges

---

### Mobile Functionality Tests

#### Test Case MT-001: Initial Collapsed State
**Objective:** Verify only 2 guests show initially

**Steps:**
1. Open application on mobile device (<768px viewport)
2. Navigate to hero section
3. Count visible guest badges

**Expected Result:**
- ✅ Exactly 2 guest badges visible
- ✅ "2 more" link displayed below badges
- ✅ Link is blue (#2b7fff) and underlined
- ✅ Badges properly formatted

**Pass Criteria:** Only first 2 guests visible with toggle link

---

#### Test Case MT-002: Expansion Interaction
**Objective:** Verify expansion reveals all guests

**Steps:**
1. Start in collapsed state (2 guests visible)
2. Tap "2 more" link
3. Observe expansion animation
4. Count total visible guests

**Expected Result:**
- ✅ All 4 guests become visible
- ✅ Smooth fade-in animation (300ms)
- ✅ Staggered appearance (50ms delay per badge)
- ✅ "2 more" changes to "show less"

**Pass Criteria:** All guests visible with smooth animation

---

#### Test Case MT-003: Collapse Interaction
**Objective:** Verify collapse returns to initial state

**Steps:**
1. Start in expanded state (all guests visible)
2. Tap "show less" link
3. Observe collapse behavior
4. Count visible guests

**Expected Result:**
- ✅ Only 2 guests remain visible
- ✅ Immediate collapse (no exit animation)
- ✅ "show less" changes back to "2 more"
- ✅ First 2 guests retained

**Pass Criteria:** Clean return to collapsed state

---

#### Test Case MT-004: Multiple Toggle Cycles
**Objective:** Verify repeated toggling works correctly

**Steps:**
1. Start collapsed (2 guests)
2. Tap "2 more" → expanded (4 guests)
3. Tap "show less" → collapsed (2 guests)
4. Repeat steps 2-3 five times

**Expected Result:**
- ✅ Each expansion shows all 4 guests
- ✅ Each collapse shows only 2 guests
- ✅ Animations consistent every cycle
- ✅ No performance degradation
- ✅ No memory leaks

**Pass Criteria:** Reliable toggling through 5+ cycles

---

## 2. Visual Regression Testing

### Desktop Visual Tests

#### Test Case VD-001: Color Accuracy
**Objective:** Verify all colors match specifications

**Checkpoints:**
- [ ] Badge background: #18181b (zinc-900)
- [ ] Badge border: rgba(255,254,254,0.05)
- [ ] Badge hover: #27272a (zinc-800)
- [ ] Guest name: #ffffff (white)
- [ ] Guest title: #70707b (gray-500)
- [ ] Avatar colors:
  - [ ] KB: #f97316 (orange-500)
  - [ ] AN: #3b82f6 (blue-500)
  - [ ] RS: #10b981 (emerald-500)
  - [ ] NK: #6b7280 (gray-500)

**Validation Method:** Use browser DevTools color picker

---

#### Test Case VD-002: Typography Verification
**Objective:** Verify font sizes, weights, and families

**Checkpoints:**
- [ ] Guest name: 15px, medium (500), Arial-Regular
- [ ] Guest title: 12px, regular (400), Arial-Regular
- [ ] Avatar initials: 12px, bold (700), Arial-Bold
- [ ] Line height: tight (1.25) for text container

**Validation Method:** Inspect computed styles in DevTools

---

#### Test Case VD-003: Spacing Accuracy
**Objective:** Verify all spacing matches specifications

**Checkpoints:**
- [ ] Avatar size: 32px × 32px
- [ ] Avatar to text gap: 12px
- [ ] Badge padding: 8px (left) / 20px (right) / 10px (top/bottom)
- [ ] Badge gap: 12px between badges
- [ ] Name to title gap: 2px

**Validation Method:** Measure with browser ruler tools

---

### Mobile Visual Tests

#### Test Case VM-001: Mobile Color Accuracy
**Objective:** Verify mobile colors match desktop (with toggle link)

**Checkpoints:**
- [ ] All badge colors match desktop
- [ ] Toggle link: #2b7fff (blue)
- [ ] Toggle hover: #5a9fff (lighter blue)
- [ ] Toggle active: #1a5fbf (darker blue)
- [ ] Underline: rgba(43, 127, 255, 0.3)

---

#### Test Case VM-002: Mobile Typography
**Objective:** Verify mobile font specifications

**Checkpoints:**
- [ ] Guest name: 14px, medium (500)
- [ ] Guest title: 11px, regular (400)
- [ ] Toggle link: 14px, medium (500)
- [ ] Avatar initials: 12px, bold (700)

---

#### Test Case VM-003: Mobile Spacing
**Objective:** Verify mobile spacing specifications

**Checkpoints:**
- [ ] Avatar size: 28px × 28px
- [ ] Avatar to text gap: 10px
- [ ] Badge padding: 6px (left) / 16px (right) / 6px (top/bottom)
- [ ] Badge gap: 8px between badges
- [ ] Badge to toggle gap: 10px

---

## 3. Animation Testing

### Test Case AN-001: Expansion Animation Smoothness
**Objective:** Verify smooth fade-in animation

**Steps:**
1. Start in collapsed state
2. Tap "2 more"
3. Record screen at 60fps
4. Analyze frame-by-frame

**Expected Result:**
- ✅ Consistent 60fps throughout
- ✅ No frame drops or stuttering
- ✅ Smooth opacity transition (0 → 1)
- ✅ Smooth position transition (-8px → 0)
- ✅ 300ms total duration

**Pass Criteria:** Maintain ≥55fps during animation

---

### Test Case AN-002: Stagger Timing
**Objective:** Verify staggered badge appearance

**Steps:**
1. Expand from collapsed state
2. Time appearance of each badge
3. Calculate delay between badges

**Expected Result:**
- ✅ Badge 3 starts at 0ms
- ✅ Badge 4 starts at 50ms
- ✅ Total sequence: 350ms (300ms animation + 50ms stagger)
- ✅ Visually distinct cascade effect

**Pass Criteria:** 50ms ± 5ms delay between badges

---

### Test Case AN-003: Animation Performance
**Objective:** Verify no performance issues during animation

**Steps:**
1. Open Chrome DevTools Performance tab
2. Start recording
3. Toggle expansion 3 times
4. Stop recording and analyze

**Expected Result:**
- ✅ No layout thrashing
- ✅ GPU-accelerated transforms
- ✅ No forced reflows
- ✅ Memory usage stable

**Pass Criteria:** No performance warnings in DevTools

---

## 4. Responsive Testing

### Test Case RS-001: Breakpoint Transition
**Objective:** Verify smooth transition at 768px breakpoint

**Steps:**
1. Start at 767px width (mobile)
2. Slowly resize to 769px (desktop)
3. Observe layout change

**Expected Result:**
- ✅ Instant layout switch at 768px
- ✅ No intermediate broken states
- ✅ Toggle link disappears
- ✅ All guests immediately visible

**Pass Criteria:** Clean breakpoint transition

---

### Test Case RS-002: Mobile Device Testing Matrix

| Device | Viewport | Layout | Toggle | Pass |
|--------|----------|--------|--------|------|
| iPhone SE | 375×667 | ✓ | ✓ | [ ] |
| iPhone 12 | 390×844 | ✓ | ✓ | [ ] |
| iPhone 14 Pro Max | 430×932 | ✓ | ✓ | [ ] |
| Samsung Galaxy S21 | 360×800 | ✓ | ✓ | [ ] |
| iPad Mini | 768×1024 | Desktop | N/A | [ ] |
| iPad Pro | 1024×1366 | Desktop | N/A | [ ] |

**Pass Criteria:** All devices render correctly per layout type

---

### Test Case RS-003: Desktop Resolution Testing Matrix

| Resolution | Layout | Wrapping | Pass |
|------------|--------|----------|------|
| 768×1024 | 2 columns | ✓ | [ ] |
| 1024×768 | 3-4 badges | ✓ | [ ] |
| 1280×720 | Single row | ✓ | [ ] |
| 1920×1080 | Single row | ✓ | [ ] |
| 2560×1440 | Single row | ✓ | [ ] |

**Pass Criteria:** Appropriate wrapping at each resolution

---

## 5. Accessibility Testing

### Test Case AC-001: Keyboard Navigation
**Objective:** Verify full keyboard accessibility

**Steps:**
1. Load page on mobile (<768px)
2. Press Tab key to navigate to toggle link
3. Press Enter/Space to activate
4. Press Tab again

**Expected Result:**
- ✅ Toggle link receives focus indicator
- ✅ Enter key expands/collapses
- ✅ Space key expands/collapses
- ✅ Focus indicator visible and clear

**Pass Criteria:** Full keyboard control without mouse

---

### Test Case AC-002: Screen Reader Testing

**Test with NVDA (Windows):**
- [ ] "Button, Show 2 more guests, collapsed"
- [ ] After expansion: "Button, Show less guests, expanded"
- [ ] Guest names announced correctly
- [ ] Guest titles announced correctly

**Test with VoiceOver (iOS):**
- [ ] Same announcements as NVDA
- [ ] Swipe navigation works
- [ ] Double-tap activates toggle

**Pass Criteria:** All content announced correctly

---

### Test Case AC-003: ARIA Attributes
**Objective:** Verify proper ARIA implementation

**Checkpoints:**
- [ ] `aria-expanded="false"` when collapsed
- [ ] `aria-expanded="true"` when expanded
- [ ] `aria-label` updates dynamically
- [ ] Proper button role (implicit from element)

**Validation Method:** Inspect HTML with DevTools

---

### Test Case AC-004: Color Contrast
**Objective:** Verify WCAG AA compliance

**Ratios to Check:**
- [ ] Guest name (white on zinc-900): ≥4.5:1 ✓
- [ ] Guest title (gray on zinc-900): ≥4.5:1 ✓
- [ ] Toggle link (blue on black): ≥4.5:1 ✓
- [ ] Avatar initials (white on colored): ≥4.5:1 ✓

**Tool:** WebAIM Contrast Checker

**Pass Criteria:** All ratios ≥4.5:1 (WCAG AA)

---

### Test Case AC-005: Focus Indicators
**Objective:** Verify visible focus states

**Steps:**
1. Navigate with keyboard
2. Observe focus indicator on toggle link
3. Check visibility against background

**Expected Result:**
- ✅ Clear outline/border on focused element
- ✅ Sufficient contrast (≥3:1 with adjacent colors)
- ✅ Does not rely solely on color change

**Pass Criteria:** Focus clearly visible in all states

---

## 6. Cross-Browser Testing

### Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Pass |
|---------|---------|---------|--------|------|
| Chrome | 120+ | [ ] | [ ] | [ ] |
| Firefox | 121+ | [ ] | [ ] | [ ] |
| Safari | 17+ | [ ] | [ ] | [ ] |
| Edge | 120+ | [ ] | [ ] | [ ] |
| Samsung Internet | 23+ | N/A | [ ] | [ ] |

**Test Checklist Per Browser:**
- [ ] Layout renders correctly
- [ ] Colors display accurately
- [ ] Animations run smoothly
- [ ] Toggle functionality works
- [ ] No console errors

---

### Test Case BR-001: Safari-Specific Issues
**Known Issues to Verify:**

1. **Flexbox Gaps**
   - Verify 12px gaps in desktop
   - Verify 8px gaps in mobile
   - Check for Safari fallback if needed

2. **Backdrop-filter**
   - Not applicable (removed from new implementation)

3. **Animation Performance**
   - Verify smooth transitions
   - Check for hardware acceleration

**Pass Criteria:** No Safari-specific rendering issues

---

### Test Case BR-002: Firefox-Specific Issues
**Known Issues to Verify:**

1. **Scrollbar Styling**
   - Not applicable (no scrollable containers)

2. **Rounded Borders**
   - Verify 9999px border-radius renders as perfect pill

3. **Font Rendering**
   - Verify Arial fallback works correctly
   - Check font smoothing

**Pass Criteria:** Consistent rendering with Chrome

---

## 7. Performance Testing

### Test Case PF-001: Initial Load Performance
**Objective:** Measure component rendering time

**Steps:**
1. Open Chrome DevTools Performance tab
2. Hard refresh page (Cmd+Shift+R)
3. Wait for page load complete
4. Analyze component rendering time

**Expected Result:**
- ✅ Component renders in < 50ms
- ✅ No layout shifts (CLS = 0)
- ✅ No blocking resources

**Pass Criteria:** < 100ms rendering time

---

### Test Case PF-002: Animation Frame Rate
**Objective:** Verify 60fps during animations

**Steps:**
1. Enable FPS meter in Chrome DevTools
2. Toggle expansion on mobile
3. Monitor frame rate during animation

**Expected Result:**
- ✅ Sustained 60fps
- ✅ No dropped frames
- ✅ GPU acceleration active

**Pass Criteria:** ≥55fps average

---

### Test Case PF-003: Memory Usage
**Objective:** Verify no memory leaks

**Steps:**
1. Open Chrome DevTools Memory tab
2. Take heap snapshot
3. Toggle expansion 20 times
4. Force garbage collection
5. Take second heap snapshot
6. Compare memory usage

**Expected Result:**
- ✅ Memory usage returns to baseline
- ✅ No detached DOM nodes
- ✅ No event listener leaks

**Pass Criteria:** < 5% memory increase after GC

---

## 8. Edge Case Testing

### Test Case EC-001: Single Guest
**Objective:** Verify behavior with 1 guest only

**Setup:** Modify guest array to 1 guest

**Expected Result:**
- Desktop: 1 badge visible, no toggle
- Mobile: 1 badge visible, no toggle

---

### Test Case EC-002: Two Guests Exactly
**Objective:** Verify behavior with exactly 2 guests

**Setup:** Modify guest array to 2 guests

**Expected Result:**
- Desktop: 2 badges visible, no toggle
- Mobile: 2 badges visible, NO toggle link

---

### Test Case EC-003: Many Guests (10+)
**Objective:** Verify behavior with 10+ guests

**Setup:** Modify guest array to 10 guests

**Expected Result:**
- Desktop: All 10 visible, wrapping to multiple rows
- Mobile: 2 visible, "8 more" link shown

---

### Test Case EC-004: Long Guest Names
**Objective:** Verify text truncation/wrapping

**Setup:** Add guest with very long name (50+ characters)

**Expected Result:**
- Text wraps to multiple lines OR
- Badge expands to fit content OR
- Text truncates with ellipsis (specify which)

---

### Test Case EC-005: Missing Avatar Data
**Objective:** Verify fallback behavior

**Setup:** Remove bgColor from guest object

**Expected Result:**
- Default avatar color used OR
- Graceful error handling
- No React errors in console

---

## 9. Integration Testing

### Test Case IT-001: Hero Section Integration
**Objective:** Verify component works within hero section

**Steps:**
1. Load full page
2. Verify component positioning
3. Check interaction with surrounding elements

**Expected Result:**
- ✅ Proper spacing from other elements
- ✅ No z-index conflicts
- ✅ Responsive with hero section

---

### Test Case IT-002: Scroll Behavior
**Objective:** Verify component during page scroll

**Steps:**
1. Expand guest list on mobile
2. Scroll page up/down
3. Verify component remains stable

**Expected Result:**
- ✅ No layout shifts during scroll
- ✅ State persists during scroll
- ✅ No scroll position jumps

---

## 10. Regression Testing

### Pre-Deployment Checklist

**Functionality:**
- [ ] Desktop shows all guests by default
- [ ] Mobile shows 2 guests initially
- [ ] Toggle expands to show all guests
- [ ] Toggle collapses back to 2 guests
- [ ] Multiple toggle cycles work correctly

**Visual:**
- [ ] Colors match specifications
- [ ] Typography correct on both views
- [ ] Spacing accurate per measurements
- [ ] Animations smooth and consistent

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen readers announce correctly
- [ ] ARIA attributes present and correct
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

**Performance:**
- [ ] Component renders quickly
- [ ] Animations run at 60fps
- [ ] No memory leaks after multiple toggles
- [ ] No console errors or warnings

**Cross-Browser:**
- [ ] Chrome: All tests pass
- [ ] Firefox: All tests pass
- [ ] Safari: All tests pass
- [ ] Mobile browsers: All tests pass

---

## 11. Test Reporting Template

### Bug Report Format

```markdown
**Bug ID:** BUG-YYYY-MM-DD-###
**Component:** GuestAvatarStack
**Severity:** Critical / High / Medium / Low
**Priority:** P0 / P1 / P2 / P3

**Environment:**
- Browser: [Chrome 120, Safari 17, etc.]
- OS: [Windows 11, macOS 14, iOS 17, etc.]
- Device: [Desktop, iPhone 12, etc.]
- Viewport: [1920x1080, 390x844, etc.]

**Test Case:** [Reference test case ID]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Visual Evidence:**
[Screenshot or video URL]

**Console Errors:**
```
[Paste console output]
```

**Additional Notes:**
Any other relevant information
```

---

## 12. Automated Testing Recommendations

### Unit Tests (Jest + React Testing Library)

```typescript
describe('GuestAvatarStack', () => {
  test('renders all guests on desktop', () => {
    // Test implementation
  });

  test('renders 2 guests initially on mobile', () => {
    // Test implementation
  });

  test('expands to show all guests on toggle click', () => {
    // Test implementation
  });

  test('collapses back to 2 guests on second click', () => {
    // Test implementation
  });
});
```

### Visual Regression Tests (Percy/Chromatic)

- Capture desktop view
- Capture mobile collapsed view
- Capture mobile expanded view
- Compare against baseline screenshots

### E2E Tests (Playwright/Cypress)

```typescript
test('mobile toggle workflow', async ({ page }) => {
  // Navigate to page
  // Verify 2 guests visible
  // Click "2 more"
  // Verify 4 guests visible
  // Click "show less"
  // Verify 2 guests visible
});
```

---

## Testing Sign-Off

**QA Lead:** _____________________ **Date:** _________

**Frontend Lead:** _____________________ **Date:** _________

**Product Manager:** _____________________ **Date:** _________

---

*End of Testing Guide*
