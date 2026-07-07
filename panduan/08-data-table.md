# Data Table
Version: 2.0
Updated: 2026-07-06

# Purpose

Data tables are the primary interface for browsing, managing, and maintaining school records.

Tables must prioritize readability, speed, and efficient bulk operations.

**Modern Design:** Clean, border-less aesthetic with subtle visual cues.

---

# Design Principles

- Content first
- Easy scanning
- Consistent actions
- Comfortable spacing
- Responsive behavior
- **Modern & Elegant** - border-less design with subtle hover states

---

# Table Container

Always place tables inside a card.

```
Padding: 24px
Radius: 28px
Shadow: Soft (0 1px 3px rgba(0,0,0,0.05))
Background: White
```

---

# Modern Table Styling

## Table Structure
```
- Container: Card dengan padding 24px, radius 28px
- Header: Font medium (500), border-bottom ultra-tipis (#F1F5F9)
- Rows: Border-less, menggunakan divider lines halus
- Hover: Background subtle (#F8FAFC) + translateY(-1px)
- Selected: Background primary-soft (#EEF2FF)
```

## Table Header (Modern)
```
Height: 52px
Background: White
Font Weight: 500 (medium)
Font Size: text-sm
Color: text-secondary
Border Bottom: 1px solid #F1F5F9 (ultra-thin)
Sticky: Yes
```

## Table Rows (Modern)
```
Height: 56px
Background: White
Hover Background: #F8FAFC
Hover Effect: translateY(-1px) + subtle shadow increase
Selected Background: #EEF2FF (primary-soft)
Border: None (border-less design)
```

---

# Standard Layout

1. Page Header
2. Filter Card
3. Table
4. Pagination

---

# Filter Bar

Place filters above the table.

## Modern Filter Bar
```
Style: Soft card with background #F8FAFC
Radius: 18px
Padding: 16px-20px
Background: #F8FAFC (not white like table container)
Border: None
Filters: Horizontal layout with gap 12px
Reset Button: Outline variant, positioned at end
```

## Recommended Filters
- Search
- Academic Year
- Class
- Status
- Gender
- Date Range
- Reset Filters

Wrap filters on smaller screens.

---

# Search

Supports:
- Name
- Student ID
- Employee ID
- Class
- Subject

Debounce input for better performance.

**Search Field Styling:**
```
Height: 48px
Radius: 18px
Background: White
Border: 1px solid #E2E8F0
Icon: Leading search icon
Placeholder: Muted color
```

---

# Table Header

```
Height: 52px
Sticky: Yes
Font Weight: 500 (medium, not bold)
Background: White
Border Bottom: 1px solid #F1F5F9 (ultra-thin)

Support:
- Sorting (with arrow indicators)
- Resize (optional)
- Column visibility (optional)
```

---

# Table Rows

```
Height: 56px
Background: White (default)
Hover:
  - Background: #F8FAFC
  - Effect: translateY(-1px) + shadow
  - Transition: 200ms ease-out
Selected:
  - Background: #EEF2FF (primary-soft)
  - Checkbox: Checked with primary color
Border: None (border-less design)
```

Alternate row colors:
**Disabled** - use hover state instead for cleaner look.

---

# Columns

Align:
- Text: Left
- Numbers: Right
- Dates: Center
- Status: Center
- Actions: Right

Keep important columns visible.

---

# Status Badges

Use badge components.

Variants:
- Active
- Inactive
- Pending
- Completed
- Draft

Avoid plain colored text.

---

# Row Actions

Use three-dot menu.

Common actions:
- View
- Edit
- Duplicate
- Archive
- Delete

Primary actions should not require opening the menu when frequently used.

---

# Bulk Actions

Support:
- Select All
- Delete
- Export
- Print
- Change Status

Show bulk toolbar only when rows are selected.

---

# Empty State

Display:
- Icon
- Title
- Description
- Primary Action

---

# Loading State

Use skeleton rows.

Avoid blocking the entire page.

---

# Pagination

Bottom aligned.

Include:
- Previous
- Next
- Page Numbers
- Page Size Selector
- Total Records

Default page size:
25

Options:
10, 25, 50, 100

---

# Export

Supported:
- Excel
- PDF
- CSV

Export respects active filters.

---

# Responsive

Desktop:
Full table.

Tablet:
Horizontal scroll.

Mobile:
Card layout when necessary.

---

# Performance

Use server-side pagination for large datasets.

Lazy-load records.

Do not render unnecessary rows.

---

# Accessibility

Keyboard navigation.

Visible focus.

Screen-reader friendly headers.

---

# Success Criteria

Users should be able to:
- Find records quickly
- Filter efficiently
- Perform bulk actions
- Export data
- Navigate large datasets comfortably
