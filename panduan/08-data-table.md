# Data Table
Version: 1.0

# Purpose

Data tables are the primary interface for browsing, managing, and maintaining school records.

Tables must prioritize readability, speed, and efficient bulk operations.

---

# Design Principles

- Content first
- Easy scanning
- Consistent actions
- Comfortable spacing
- Responsive behavior

---

# Table Container

Always place tables inside a card.

Padding: 24px

Radius: 28px

Soft shadow only.

---

# Standard Layout

1. Page Header
2. Filter Card
3. Table
4. Pagination

---

# Filter Bar

Place filters above the table.

Recommended:
- Search
- Academic Year
- Class
- Status
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

---

# Table Header

Height: 52px

Sticky: Yes

Support:
- Sorting
- Resize (optional)
- Column visibility (optional)

---

# Table Rows

Height: 56px

Hover:
- Soft background

Selected:
- Highlight row
- Checkbox checked

Alternate row colors:
Disabled.

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
