# Layout System
Version: 1.0

## Goal
Define a consistent application layout for the School Information System.

---

# Application Shell

Desktop layout consists of:
- Floating Sidebar
- Top Navigation
- Main Content

```
+--------------------------------------------------------------+
| Sidebar | Top Navigation                                     |
|         +----------------------------------------------------+
|         |                                                    |
|         | Main Content                                       |
|         |                                                    |
|         |                                                    |
+---------+----------------------------------------------------+
```

---

# Viewport

Target desktop width:
- 1440–1920px

Minimum supported width:
- 1280px

Tablet:
- Responsive adaptation

Mobile:
- Secondary priority.

---

# Sidebar

Desktop layout:
- Fixed position, full height (from viewport top to bottom)
- No margin/gap from edges
- Flat left edge (no border-radius on left)

Width (Expanded): 240px
Width (Collapsed): 64px

Border Radius:
- 0px on left side
- Optional subtle radius on right edge for visual accent (optional)

Glass opacity:
82%

Blur:
12px

Header Content:
- Logo icon (GraduationCap)
- School title: "SMKN 2 Sragen" (text-[13px])
- Subtitle: "Taruna" (text-[11px])
- Collapse button (PanelLeftClose icon) - only visible when expanded

Collapse Behavior:
- Expanded: Logo + Title + Collapse button visible
- Collapsed: Logo only, click logo to expand
- Collapse button hidden when collapsed
- Animation: 300ms ease-out transition

Navigation Content:
- Navigation groups (collapsible sections)
- User profile at bottom
- Active item: pill background with primary accent

Navigation Groups:
- AKADEMIK
- PRESENSI
- PENILAIAN
- POIN KARAKTER
- AKADEMIK LAINNYA
- ADMINISTRASI
- LAPORAN
- SISTEM

Active nav item:
- Pill background
- Radius 18px
- Primary color
- Left icon + label (when expanded)
- Icon only (when collapsed)

---

# Top Navigation

Height:
80px

Contents:
- Global search
- Academic year selector
- Semester selector
- Notifications
- Quick create button
- User menu

Padding:
0 32px

Sticky:
Yes

---

# Main Content

Padding:
40px

Maximum width:
1600px

Horizontal center:
Enabled

Section spacing:
32px

Card spacing:
24px

---

# Grid

Desktop:
12 columns

Gap:
24px

Recommended spans:
- KPI card: 3 columns
- Half width: 6 columns
- Large chart: 8 columns
- Side panel: 4 columns
- Full width: 12 columns

---

# Page Structure

1. Page Header
2. Quick Actions (optional)
3. Summary Cards
4. Main Content
5. Secondary Content

---

# Page Header

Contains:
- Title
- Description
- Breadcrumb (optional)
- Primary action
- Secondary actions

Do not place filters here.

---

# Filter Bar

Filters should appear inside a dedicated card below the header.

Examples:
- Search
- Academic year
- Class
- Status
- Date range

Use responsive wrapping.

---

# Card Rules

Default padding:
28px

Radius:
28px

Cards should not touch each other.

Prefer grouped cards instead of many tiny cards.

---

# Tables

Always inside cards.

Features:
- Sticky header
- Comfortable row height
- Rounded container
- Pagination at bottom
- Filters above table

---

# Forms

Forms should use:
- Single column for simple pages
- Two columns for desktop when appropriate

Maximum form width:
960px

Group related fields into sections.

---

# Modals

Max width:
720px

Radius:
32px

Padding:
32px

Avoid very long forms inside modals.

---

# Empty States

Every page should define:
- Illustration or icon
- Title
- Short explanation
- Primary action

---

# Loading States

Use skeleton loaders.

Avoid large spinners unless absolutely necessary.

---

# Responsive Rules

>=1440px:
Comfortable spacing.

1280–1439px:
Reduce outer padding only.

<1024px (Tablet/Mobile):
- Sidebar hidden
- Mobile drawer sidebar replaces desktop sidebar
- Hamburger menu button in header
- Swipe to open drawer

---

# Layout Principles

- Consistent spacing
- Predictable placement
- Spacious composition
- Minimal visual noise
- Content first
- Actions easy to reach

Every new page must follow this layout system before introducing custom structures.
