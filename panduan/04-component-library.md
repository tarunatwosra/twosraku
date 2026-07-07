# Component Library
Version: 2.0
Updated: 2026-07-06

---

# Purpose

This document defines every reusable UI component used throughout the School Information System.

The primary goals are:

- Consistency
- Reusability
- Accessibility
- Premium appearance
- Predictable interactions
- **Modern & Elegant** - clean design with subtle animations

No page should introduce custom component styles unless absolutely necessary.

---

# Design Philosophy

Every component should feel:

- Soft
- Modern & Elegant
- Spacious
- Calm
- Premium
- Fast
- Professional

Avoid:

- Bootstrap appearance
- Material Design appearance
- Heavy borders
- Heavy shadows
- Sharp corners
- Excessive colors
- Dated/outdated styling

**Modern Design Principles:**
- Border-less or ultra-thin borders where possible
- Subtle lift effects on hover (translateY)
- Generous whitespace
- Smooth transitions (200ms ease-out)
- Soft shadows (elevation without weight)

---

# Border Radius Standard

| Component | Radius |
|-----------|--------|
| Badge | 999px |
| Checkbox | 8px |
| Radio | Full |
| Input | 18px |
| Select | 18px |
| Button | 18px |
| Card | 28px |
| Modal | 32px |
| Sidebar | 32px |
| Dropdown | 18px |
| Avatar | 18px |

---

# Button

## Sizes

Small

Height

36px

Default

44px

Large

52px

Padding

Horizontal

22px

Vertical

14px

Radius

18px

Icon

20px

---

## Variants

### Primary Button
- **Style:** Filled, solid background
- **Background:** Blue (`#2563EB`)
- **Text:** White
- **Font Weight:** Semibold (600)
- **Use case:** Main actions, primary CTAs (e.g., "Tambah Siswa")

### Secondary Button
- **Style:** Light background with thin border
- **Background:** Light gray (`#F8FAFC`)
- **Text:** Dark (`#1E293B`)
- **Border:** 1px solid light gray (`#E2E8F0`)
- **Hover:** Background slightly darker, border darker, text darker
- **Use case:** Secondary actions, less prominent CTAs

### Outline Button
- **Style:** Transparent background with subtle border
- **Background:** Transparent
- **Text:** Muted gray (`#64748B`)
- **Border:** 1px solid light gray (`#E2E8F0`) - very subtle
- **Hover:** Background light gray (`#F8FAFC`), border darker (`#CBD5E1`), text dark (`#1E293B`)
- **Use case:** Tertiary actions, filter, export, column configuration

### Ghost Button
- **Style:** Fully transparent with no border
- **Background:** Transparent
- **Text:** Muted gray (`#64748B`)
- **Border:** Transparent
- **Hover:** Background light gray (`#F1F5F9`), text dark (`#1E293B`)
- **Use case:** Icon buttons, inline actions, refresh, dismiss

### Danger Button
- **Style:** Filled, red background
- **Background:** Red (`#EF4444`)
- **Text:** White
- **Font Weight:** Semibold (600)
- **Use case:** Destructive actions, delete

### Success Button
- **Style:** Filled, green background
- **Background:** Green (`#22C55E`)
- **Text:** White
- **Font Weight:** Semibold (600)
- **Use case:** Confirm actions, positive outcomes

---

## States

| State | Primary | Secondary | Outline | Ghost |
|-------|---------|-----------|---------|-------|
| Default | Blue bg, white text | Light bg, dark text | Transparent bg, muted text, thin border | Transparent, muted text |
| Hover | Darker blue, lift effect | Darker bg, darker border | Light bg, dark text | Light bg, dark text |
| Active | Darker blue | Darker bg | Light bg | Light bg |
| Disabled | 40% opacity | 40% opacity | 40% opacity | 40% opacity |
| Loading | Spinner + "Memuat..." | Same | Same | Same |

---

## Button Specifications

### Primary Button
```
Default:  bg: #2563EB, color: #FFFFFF, font-weight: 600
Hover:    bg: #1D4ED8, transform: translateY(-1px)
Active:   bg: #1D4ED8 (darker)
```

### Secondary Button
```
Default:  bg: #F8FAFC, color: #1E293B, border: 1px solid #E2E8F0
Hover:    bg: #F1F5F9, border: 1px solid #CBD5E1, color: #1E293B
```

### Outline Button
```
Default:  bg: transparent, color: #64748B, border: 1px solid #E2E8F0
Hover:    bg: #F8FAFC, color: #1E293B, border: 1px solid #CBD5E1
```

### Ghost Button
```
Default:  bg: transparent, color: #64748B, border: 1px solid transparent
Hover:    bg: #F1F5F9, color: #1E293B
```

---

## Animation

- **Duration:** 200ms ease-out
- **Hover effect:** translateY(-1px) - subtle lift with shadow increase
- **Active effect:** translateY(0) - returns to normal
- **Transition:** All properties

### Modern Button Hover
```
Primary: bg darkens, subtle lift (+shadow)
Secondary: bg darkens, border darkens
Outline/Ghost: bg appears, subtle lift
```

---

## Icon Button

Square

44 × 44

Radius

18px

Centered icon

20px

---

# Card

## Modern Card Design

### Standard Card
```
Padding: 24px (default), 32px (large)
Radius: 28px
Background: White (#FFFFFF)
Shadow: Soft, 0 1px 3px rgba(0,0,0,0.05)
Border: Optional subtle border (1px #F1F5F9)
Gap: 24px between cards
```

### Elevated Card (for headers/featured content)
```
Background: White with subtle gradient overlay
Shadow: Medium, 0 4px 6px rgba(0,0,0,0.07)
Border: Optional primary tint border
Padding: 28px-32px
```

### Soft Card (for section backgrounds)
```
Background: #F8FAFC (surface-secondary)
Shadow: None
Border: None
Radius: 18px-24px
Padding: 20px-24px
```

## Card Structure

Header

Optional Description

Body

Footer

---

# KPI Card

Contains

Icon

Title

Value

Trend

Optional chart

Large number should be dominant.

---

# Input

Height

48px

Radius

18px

Padding

16px

Border

1px

Focus

Blue border

Soft shadow

Placeholder

Muted color

---

# Textarea

Minimum Height

120px

Resizable

Vertical only

Radius

18px

---

# Select

Same appearance as Input.

Dropdown Radius

18px

Dropdown Padding

8px

Scrollable

Yes

Searchable when options > 10.

---

# Checkbox

Size

20px

Radius

8px

Checked

Primary Blue

---

# Radio Button

Size

20px

Primary Blue

---

# Switch

Height

28px

Width

52px

Smooth animation

---

# Badge

Height

28px

Horizontal Padding

12px

Radius

999px

Variants

Primary

Success

Warning

Danger

Neutral

---

# Avatar

Small

32px

Medium

40px

Large

48px

Radius

18px

Fallback

User initials

---

# Dropdown

Radius

18px

Padding

8px

Shadow

Medium

Animation

Fade + Scale

---

# Modal

Radius

32px

Padding

32px

Maximum Width

720px

Scrollable

Yes

Background Blur

16px

---

# Drawer

Right side

Width

480px

Radius

32px

Padding

32px

---

# Tabs

## Modern Pill Tabs (Recommended)

### Structure
```
- Container: Flex with gap-2, no border-bottom
- Tab Button: Rounded pill shape
- Active: Background primary (#2563EB), text white
- Inactive: Background transparent, text muted gray
```

### Specifications
```
Height: Auto (min 36px)
Padding: 12px horizontal, 8px vertical
Gap: 8px between tabs
Radius: 999px (full rounded)
Font: text-sm, font-medium
Transition: 200ms ease-out
```

### States
```
Default (Inactive):
  - Background: transparent
  - Text: #64748B (muted)
  - Hover: Background #F1F5F9, text #334155

Active:
  - Background: #2563EB (primary blue)
  - Text: #FFFFFF (white)
  - No underline indicator
```

### Legacy Tabs (Underline Style)
- Using border-bottom indicator
- Active text color: primary
- Underline: 2px solid primary
- Gap: 0px (full width)
- **Deprecated** - use pill tabs instead

---

# Breadcrumb

Small typography

Muted color

Chevron separator

Current page

Bold

---

# Search Field

Leading icon

Search placeholder

Clear button

Height

48px

Radius

18px

---

# Data Table

Always inside Card.

Features

Sticky Header

Hover Row

Rounded Container

Pagination

Column Sorting

Search

Filter

Bulk Selection

Density Toggle

---

## Row Height

56px

---

## Header Height

52px

---

## Actions

Right aligned

Three-dot menu

---

# Pagination

Rounded buttons

Compact

Current page highlighted

---

# Empty State

Contains

Illustration

Title

Description

Primary Action

Secondary Action

Centered vertically

---

# Loading

Use Skeleton Loader.

Avoid full-page spinner.

Skeleton should match component layout.

---

# Toast

Position

Top Right

Radius

18px

Auto Close

4 seconds

Variants

Success

Warning

Danger

Info

---

# Alert

Radius

20px

Icon

Left

Actions

Optional

---

# Timeline

## Modern Vertical Timeline

### Structure
```
- Vertical layout with connector line
- Dot indicators for each event
- Content aligned next to dot
- Timestamp right-aligned or below title
```

### Specifications
```
Dot Size: 32px diameter
Dot Shape: Full circle
Icon Size: 16px centered in dot
Connector: 2px width, muted color
Content Gap: 12px from dot
Row Gap: 0px (connected timeline)
```

### Dot Variants
```
Success: bg-green-100, text-green-600
Info: bg-blue-100, text-blue-600
Warning: bg-yellow-100, text-yellow-600
Danger: bg-red-100, text-red-600
Neutral: bg-gray-100, text-gray-600
```

### Content Styling
```
Title: text-[13px], font-medium, text-primary
Description: text-[12px], text-secondary, mt-0.5
Timestamp: text-[11px], text-muted, right-aligned
```

### Animation
```
- Smooth fade-in on load
- Connector line draws progressively
- Dot scales slightly on hover
```

---

# Calendar Card

Rounded

Minimal

Today's date highlighted

Upcoming events

---

# Statistic Widget

Contains

Icon

Title

Large Number

Trend

Optional Mini Chart

Avoid unnecessary decoration.

---

# Chart Container

Radius

28px

Padding

28px

White background

Thin grid lines

Minimal legend

---

# Accordion

Radius

20px

Smooth expand animation

Chevron rotates

---

# Tooltip

Dark background

White text

Small shadow

Radius

12px

---

# Floating Action Button

Desktop only

56px

Primary Blue

Bottom Right

---

# Progress Bar

Height

8px

Rounded

Animated

Variants

Blue

Green

Orange

Red

---

# File Upload

Drag & Drop

Dashed Border

Rounded

Large Icon

Supported formats displayed below

---

# Component Spacing

Small

8px

Medium

16px

Large

24px

Section

32px

---

# Interaction Rules

Hover

Subtle

Focus

Visible

Disabled

Reduced opacity

Loading

Non-blocking

Transitions

200ms ease-out

---

# Accessibility

Minimum touch target

44px

Keyboard Navigation

Required

Visible Focus

Required

Contrast

WCAG AA

---

# Consistency Rules

Every page must use these components.

Do not redesign components on individual pages.

If a new component is required:

1. Add it to this document.
2. Define all variants.
3. Define interaction states.
4. Reuse everywhere.

Consistency has higher priority than creativity.