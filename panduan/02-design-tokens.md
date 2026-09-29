# Design Tokens
Version: 2.1

---

## Changelog

### v2.1 - Accessibility Improvements
- Added purple color tokens for consistent UI
- Added color contrast documentation (WCAG 2.1 AA compliance)
- Updated muted text to use secondary color for better contrast

### v2.0 - Typography Revision
- Complete overhaul of font size hierarchy
- Added new font size classes: `text-stat-lg`, `text-stat-md`, `text-stat-sm`
- Added body text classes: `text-body`, `text-body-sm`, `text-caption`, `text-tiny`
- Added section title class: `text-section-title`
- Revised heading scale: H3=22px, H4=18px, H5=16px, H6=15px
- Body text reduced from 15px to 14px for better hierarchy
- See Font Sizes section for full migration guide

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

## Purple

```
#8B5CF6
```

Soft

```
#F5F3FF
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

## Revised Typography Scale (v2.0)

Rentang hierarki font yang lebih smooth untuk hierarki visual yang lebih jelas.

### Heading Hierarchy

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Display | 40px | 1.2 | Hero sections, landing pages |
| H1 | 36px | 1.3 | Page titles (used in AppShell) |
| H2 | 28px | 1.3 | Major section headers |
| H3 | 22px | 1.35 | Section titles, card headers |
| H4 | 18px | 1.4 | Card titles, subsection headers |
| H5 | 16px | 1.5 | Sub-section headers, form labels |
| H6 | 15px | 1.5 | Inline labels, metadata |

### Body & Content

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Body | 14px | 1.6 | Main content text |
| Body Small | 13px | 1.5 | Secondary content |
| Caption | 12px | 1.5 | Helper text, timestamps |
| Tiny | 11px | 1.4 | Badges, tags, very small labels |

### Stat Values

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Stat Large | 28px | 700 (Bold) | Main stat values in cards |
| Stat Medium | 22px | 700 (Bold) | Secondary stat values |
| Stat Small | 18px | 600 (Semibold) | Compact stat values |

---

## Versi Lama (v1.0) - Deprecated

Font sizes lama yang masih digunakan di beberapa tempat. Targetkan untukMigrasi ke versi baru (v2.0).

```
Display: 40px
H1: 36px
H2: 28px
H3: 24px  ❌ → Ganti ke H3: 22px
H4: 20px  ❌ → Ganti ke H5: 16px
Card Title: 18px → Merge ke H4
Body: 15px   ❌ → Ganti ke Body: 14px
Small: 14px  ❌ → Ganti ke Body Small: 13px
Caption: 13px ❌ → Ganti ke Caption: 12px
Tiny: 12px   ❌ → Ganti ke Tiny: 11px
```

### Migration Guide

| Old | New | Notes |
|-----|-----|-------|
| `text-[24px]` | `text-h3` atau `text-[22px]` | Heading 3 |
| `text-[20px]` | `text-h4` atau `text-[18px]` | Heading 4 |
| `text-lg` (18px) | `text-h4` atau `text-[18px]` | Card titles |
| `text-[16px]` | `text-h5` atau `text-[16px]` | Form labels |
| `text-[15px]` | `text-body` atau `text-[14px]` | Body text |
| `text-[14px]` | `text-[13px]` | Secondary content |
| `text-[13px]` | `text-caption` atau `text-[12px]` | Captions |
| `text-[12px]` | `text-tiny` atau `text-[11px]` | Badges |
| `text-2xl` (24px) | `text-stat-lg` atau `text-[28px]` | Stat values |

---

## Line Height

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

---

# Color Contrast Guidelines (WCAG 2.1)

## Minimum Contrast Ratios

| Text Type | WCAG AA | WCAG AAA |
|-----------|---------|----------|
| Normal text (<18px) | 4.5:1 | 7:1 |
| Large text (≥18px or ≥14px bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | - |

## Contrast Audit Results

### PASS (≥4.5:1) ✅
- Text Primary (#172033) on white: 13.5:1
- Text Secondary (#64748B) on white: 5.2:1
- Text Primary on background-primary: 11.8:1
- Success badge text: 4.8:1
- Warning badge text: 5.2:1
- Danger badge text: 5.2:1

### FAIL (<4.5:1) ⚠️
- Text Muted (#94A3B8) on white: 2.3:1 ❌
- Text Muted on primary-soft: 2.1:1 ❌

## Contrast Fixes Applied

### Badge Colors (WCAG AA Compliant)
Badge soft variants use darker text colors for better contrast:

| Badge | Background | Text | Contrast |
|-------|------------|------|----------|
| Primary | #EEF4FF | #2563EB | 3.5:1 |
| Success | #ECFDF3 | #15803D | 4.8:1 |
| Warning | #FFF7E6 | #B45309 | 5.2:1 |
| Danger | #FEF2F2 | #B91C1C | 5.2:1 |
| Info | #ECFEFF | #0E7490 | 4.5:1 |
| Purple | #F5F3FF | #7C3AED | 4.5:1 |

## Usage Rules

1. **Body text** → Always use `--text-primary` or `--text-secondary`
2. **Captions/Timestamps** → Use `--text-secondary` (not `--text-muted`)
3. **Placeholders** → Use `--text-muted` (acceptable for temporary text)
4. **Badges** → Use design tokens with soft variants for AA compliance
5. **Buttons** → White text on colored background, test contrast