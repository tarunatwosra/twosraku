# Motion
Version: 1.0

# Purpose

Motion enhances usability by providing visual feedback, guiding attention, and communicating state changes.

Animations should feel fast, subtle, and purposeful.

Never animate for decoration alone.

---

# Principles

- Motion follows user intent
- Fast over flashy
- Consistent timing
- Preserve context
- Respect accessibility

---

# Duration

Micro: 100ms

Fast: 150ms

Default: 200ms

Complex: 300ms

Maximum: 400ms

---

# Easing

Default:
ease-out

Entrance:
ease-out

Exit:
ease-in

Interactive:
ease-out

Avoid elastic or bouncing animations.

---

# Hover

Buttons:
- Lift 2px
- Scale 1.02
- Slight shadow increase

Cards:
- Shadow increase
- Lift 2px only

Navigation:
- Soft background fade

---

# Focus

Show visible focus ring.

Animate opacity only.

Duration:
150ms

---

# Press

Buttons:
Scale 0.98

Duration:
100ms

---

# Page Transitions

Keep subtle.

Fade:
150–200ms

Do not slide entire pages.

---

# Sidebar

Expand/Collapse:
300ms

Icons remain aligned.

Labels fade smoothly.

---

# Dropdown

Animation:
Fade + Scale

Scale:
0.98 → 1.00

Duration:
180ms

---

# Modal

Backdrop:
Fade

Dialog:
Fade + Scale

Duration:
200ms

---

# Drawer

Slide from edge.

Duration:
250ms

Backdrop fades simultaneously.

---

# Tooltip

Fade only.

Duration:
120ms

---

# Toast

Slide slightly from top-right.

Fade in.

Auto dismiss:
4 seconds

---

# Accordion

Animate height and opacity.

Duration:
200ms

---

# Tabs

Indicator slides smoothly.

Content fades quickly.

Duration:
180ms

---

# Tables

Row hover:
Background fade.

Sorting:
No dramatic animation.

Loading:
Skeleton shimmer only.

---

# Charts

Animate once on initial load.

Duration:
300ms

Do not replay repeatedly.

---

# Skeleton

Use subtle shimmer.

Avoid flashing.

---

# Loading

Prefer skeletons over spinners.

Use spinners only for short blocking actions.

---

# Reduced Motion

Respect operating system preferences.

Disable:
- Scale
- Slide
- Parallax

Keep only opacity transitions.

---

# Accessibility

Animations must never block interaction.

Motion should not trigger discomfort.

---

# Success Criteria

Motion should:
- Confirm user actions
- Improve orientation
- Feel responsive
- Never distract from content
