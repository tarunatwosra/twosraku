# Claude Rules
Version: 1.0

---

# Purpose

This document is the master instruction for Claude Code.

All implementations must follow this document together with the complete Design System.

If there is any conflict between files, this document takes precedence.

Never ignore these rules.

---

# Project Goal

Build a premium School Information System.

The application should feel comparable to products such as:

- Linear
- Stripe Dashboard
- Vercel Dashboard
- Notion
- Raycast

The interface must be:

- Modern
- Professional
- Calm
- Spacious
- Fast
- Consistent

Avoid looking like a Bootstrap template.

---

# Source of Truth

Always follow the documents in this order.

1.
01-design-principles.md

↓

2.
02-design-tokens.md

↓

3.
03-layout-system.md

↓

4.
04-component-library.md

↓

5.
05-navigation.md

↓

6.
06-dashboard.md

↓

7.
07-form-guidelines.md

↓

8.
08-data-table.md

↓

9.
09-page-patterns.md

↓

10.
10-motion.md

↓

11.
11-accessibility.md

↓

12.
12-icons.md

↓

13.
13-charts.md

↓

14.
14-authentication.md

If any uncertainty exists,

use the higher document.

Never invent new design decisions.

---

# General Rules

Before creating anything,

always ask:

Does this already exist in the Design System?

If yes,

reuse it.

Never redesign components.

Never introduce new spacing.

Never introduce new radius.

Never introduce new colors.

Never introduce new shadows.

Never introduce new typography.

---

# Design Philosophy

Always prefer

Consistency

over

Creativity.

---

# Layout Rules

Every page must use

Application Shell

↓

Sidebar

↓

Top Navigation

↓

Page Header

↓

Content

↓

Footer (optional)

Never create custom layouts unless absolutely required.

---

# Components

Always use existing components.

Buttons

Cards

Inputs

Tables

Badges

Dropdowns

Tabs

Dialogs

Drawers

Toasts

Never create custom versions.

---

# Navigation

Navigation hierarchy is fixed.

Do not move menu locations.

Do not rename navigation.

Do not duplicate navigation.

---

# Typography

Always use the typography scale.

Never use arbitrary font sizes.

Never mix font families.

---

# Spacing

Use spacing tokens only.

Never use random spacing.

All spacing must come from the spacing scale.

---

# Radius

Use design tokens.

Do not create new border radius values.

---

# Shadows

Use predefined shadows only.

Never increase shadow intensity.

---

# Colors

Use only design tokens.

No custom colors.

No random gradients.

No saturated backgrounds.

---

# Glassmorphism

Allowed only on:

Sidebar

Top Navigation

Modal Backdrop

Never use glass cards.

Never blur tables.

Never blur forms.

---

# Cards

Cards should be:

White

Rounded

Spacious

Soft shadow

No heavy borders.

---

# Forms

Follow

07-form-guidelines.md

Never place more than two columns.

Never use floating labels.

Always use visible labels.

---

# Tables

Follow

08-data-table.md

Never remove pagination.

Never remove filtering.

Always support search.

---

# Charts

Follow

13-charts.md

Never use:

Pie charts for comparisons.

3D charts.

Bright gradients.

---

# Authentication

Follow

14-authentication.md

Authentication pages should remain minimal.

---

# Icons

Use Lucide Icons only.

Never mix icon libraries.

---

# Accessibility

Follow WCAG AA.

Keyboard navigation required.

Visible focus required.

44px minimum touch target.

---

# Motion

Animations should be:

Fast

Subtle

Useful

Never decorative.

---

# Responsive

Desktop first.

Tablet second.

Mobile third.

Never break desktop layouts for mobile.

---

# Performance

Prefer:

Lazy Loading

Server Pagination

Memoization

Code Splitting

Skeleton Loading

Avoid unnecessary re-rendering.

---

# Code Organization

Prefer:

Reusable Components

Composable Architecture

Small Functions

Meaningful Names

Avoid duplicated code.

---

# Naming

Components

PascalCase

Variables

camelCase

Constants

UPPER_CASE

Files

kebab-case

---

# Folder Structure

/components

/pages

/layouts

/hooks

/services

/types

/lib

/utils

/styles

---

# State Management

Prefer local state.

Use global state only when necessary.

Avoid prop drilling.

---

# API

Separate

UI

Business Logic

API Layer

Never mix them.

---

# Error Handling

Every page should support

Loading

Empty

Error

Permission

Offline

states.

---

# Quality Checklist

Before considering a page complete,

verify:

□ Layout follows layout-system

□ Tokens are used

□ Components are reused

□ Navigation correct

□ Accessibility passes

□ Responsive

□ Loading State

□ Empty State

□ Error State

□ Permission State

□ Motion implemented

□ Typography correct

□ Spacing correct

□ Shadows correct

□ Radius correct

□ Icons correct

□ Charts follow guidelines

□ Forms follow guidelines

□ Tables follow guidelines

---

# Forbidden

Never

Use Bootstrap styling.

Use Material Design defaults.

Invent new UI patterns.

Mix icon libraries.

Use random spacing.

Use random shadows.

Use random colors.

Create multiple primary buttons.

Overuse animations.

Use dark backgrounds for content.

Make crowded interfaces.

Sacrifice readability.

---

# Decision Priority

When making UI decisions,

always prioritize:

1.
Usability

↓

2.
Consistency

↓

3.
Accessibility

↓

4.
Performance

↓

5.
Visual Beauty

Beauty must never reduce usability.

---

# Definition of Done

A page is considered complete only when:

✓ Matches the Design System

✓ Uses reusable components

✓ Responsive

✓ Accessible

✓ Consistent

✓ Performant

✓ Production Ready

If one requirement fails,

the page is not finished.

---

# Final Rule

Claude Code is not designing a page.

Claude Code is extending an existing Design System.

Every implementation should feel as if it was built by the same design team on the same day.

Consistency is always more important than creativity.