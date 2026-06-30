# Component Library
Version: 1.0

---

# Purpose

This document defines every reusable UI component used throughout the School Information System.

The primary goals are:

- Consistency
- Reusability
- Accessibility
- Premium appearance
- Predictable interactions

No page should introduce custom component styles unless absolutely necessary.

---

# Design Philosophy

Every component should feel:

- Soft
- Modern
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

Primary

- Filled
- Blue background
- White text

Secondary

- Light background
- Dark text

Ghost

- Transparent

Outline

- Border only

Danger

- Red

Success

- Green

---

## States

Default

Hover

Active

Disabled

Loading

Focus

Hover effect

```
translateY(-2px)

scale(1.02)
```

Animation

200ms

---

# Icon Button

Square

44 × 44

Radius

18px

Centered icon

20px

---

# Card

Default Padding

28px

Large Padding

36px

Radius

28px

Background

White

Shadow

Soft

Cards should never touch each other.

Gap

24px

---

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

Rounded

Pill style

Active

Blue background

White text

Inactive

Gray text

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

Vertical

Circle indicator

Thin connector line

Timestamp

Title

Description

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