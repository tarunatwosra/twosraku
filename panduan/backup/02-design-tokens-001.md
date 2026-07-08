# Design Tokens
Version: 1.0

---

# Purpose

This document defines the visual foundation of the School Information System.

Every page, component, and layout must reference these tokens instead of using arbitrary values.

Consistency is more important than personal preference.

---

# Brand Personality

The interface should feel:

- Premium
- Professional
- Calm
- Modern
- Friendly
- Trustworthy
- Spacious
- Soft

Avoid:

- Flat and boring
- Overly colorful
- Heavy glassmorphism
- Strong gradients
- Bootstrap appearance
- Material Design appearance
- Template-looking dashboards

---

# Color System

## Background

Background Primary

```
#F5F7FB
```

Background Secondary

```
#FFFFFF
```

Background Tertiary

```
#F8FAFC
```

Sidebar Background

```
rgba(255,255,255,.82)
```

Sidebar Blur

```
12px
```

---

## Surface

Surface Primary

```
#FFFFFF
```

Surface Secondary

```
#FAFBFD
```

Surface Hover

```
#F3F6FA
```

Surface Active

```
#EDF3FF
```

---

## Borders

Border Light

```
#EDF1F6
```

Border Default

```
#E3EAF3
```

Border Strong

```
#D3DCE8
```

Border Focus

```
#4F7CFF
```

---

## Primary

Primary

```
#4F7CFF
```

Primary Hover

```
#3E6CF2
```

Primary Active

```
#2F5AE8
```

Primary Soft

```
#EEF4FF
```

---

## Success

```
#22C55E
```

Soft

```
#ECFDF3
```

---

## Warning

```
#F59E0B
```

Soft

```
#FFF7E6
```

---

## Danger

```
#EF4444
```

Soft

```
#FEF2F2
```

---

## Info

```
#06B6D4
```

Soft

```
#ECFEFF
```

---

# Text

Primary

```
#172033
```

Secondary

```
#64748B
```

Muted

```
#94A3B8
```

Disabled

```
#CBD5E1
```

White

```
#FFFFFF
```

---

# Icon Colors

Default

```
#5B6B83
```

Muted

```
#94A3B8
```

Primary

```
#4F7CFF
```

---

# Typography Tokens

Primary Font

```
Plus Jakarta Sans
```

Body Font

```
Inter
```

Fallback

```
system-ui
```

---

# Font Weight

Regular

```
400
```

Medium

```
500
```

SemiBold

```
600
```

Bold

```
700
```

ExtraBold

```
800
```

---

# Font Sizes

Display

```
40px
```

H1

```
36px
```

H2

```
28px
```

H3

```
24px
```

H4

```
20px
```

Card Title

```
18px
```

Body

```
15px
```

Small

```
14px
```

Caption

```
13px
```

Tiny

```
12px
```

---

# Line Height

Display

```
1.2
```

Heading

```
1.3
```

Body

```
1.6
```

Caption

```
1.5
```

---

# Spacing Scale

```
4
8
12
16
20
24
32
40
48
56
64
72
80
96
128
```

Never use random spacing.

Always reference this scale.

---

# Border Radius

Small Badge

```
999px
```

Input

```
18px
```

Button

```
18px
```

Dropdown

```
18px
```

Card

```
28px
```

Modal

```
32px
```

Sidebar

```
32px
```

Avatar

```
18px
```

Chart Container

```
28px
```

---

# Shadows

Shadow XS

```
0 1px 2px rgba(15,23,42,.04)
```

Shadow Small

```
0 4px 12px rgba(15,23,42,.05)
```

Shadow Medium

```
0 8px 24px rgba(15,23,42,.06)
```

Shadow Large

```
0 16px 40px rgba(15,23,42,.08)
```

Avoid heavy shadows.

---

# Blur

Sidebar

```
12px
```

Top Navigation

```
12px
```

Modal

```
16px
```

Do not blur cards.

---

# Opacity

Glass

```
82%
```

Disabled

```
40%
```

Hover Overlay

```
6%
```

---

# Button Height

Small

```
36px
```

Default

```
44px
```

Large

```
52px
```

---

# Input Height

Default

```
48px
```

Large

```
56px
```

---

# Card Padding

Small

```
20px
```

Default

```
28px
```

Large

```
36px
```

---

# Layout

Sidebar Width

```
280px
```

Topbar Height

```
80px
```

Content Padding

```
40px
```

Card Gap

```
24px
```

Section Gap

```
32px
```

Grid Columns

```
12
```

Max Width

```
1600px
```

---

# Animation

Default

```
200ms
```

Fast

```
150ms
```

Slow

```
300ms
```

Timing

```
ease-out
```

Hover Scale

```
1.02
```

Hover Lift

```
translateY(-2px)
```

---

# Z Index

Dropdown

```
100
```

Sticky Header

```
200
```

Sidebar

```
300
```

Modal

```
1000
```

Toast

```
1200
```

Tooltip

```
1300
```

---

# Grid

Desktop

```
12 columns
```

Gap

```
24px
```

---

# Component Rules

Never use:

- Random colors
- Random spacing
- Random radius
- Random shadows

Every component must use the tokens defined in this document.

If a value is not listed here, it should not be introduced without updating this design token file.
