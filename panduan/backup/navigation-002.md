# Navigation
Version: 1.0

# Purpose

This document defines all navigation patterns for the School Information System.

Navigation must be predictable, consistent, and efficient.

---

# Principles

- Minimize clicks
- Keep users oriented
- Maintain consistency
- Prioritize frequently used features
- Never hide essential navigation

---

# Application Navigation

The application consists of:

- Floating Sidebar
- Top Navigation
- Breadcrumb
- Tabs
- Pagination
- Command Search

---

# Sidebar

Layout:
- Fixed position, full height (no top/bottom margin)
- No left margin (stick to left edge)
- Flat left edge

Width (Expanded): 240px
Width (Collapsed): 64px

Border Radius:
- Flat on left side
- No floating effect (no 32px radius)

Glass effect:
- Background: rgba(255, 255, 255, 0.82)
- Backdrop blur: 12px

Header Structure:
```
Expanded:  [Logo] [SMKN 2 Sragen / Taruna]  [Collapse Icon]
Collapsed: [Logo]  ← clickable to expand
```

Collapse Button Behavior:
- Expanded: PanelLeftClose icon visible on right side of header
- Collapsed: Button hidden, logo becomes clickable
- Click logo when collapsed → expand sidebar
- Animation: 300ms ease-out

Navigation Hierarchy:
- AKADEMIK
  - Dashboard
  - Buku Induk
  - Data Siswa
- PRESENSI
  - Presensi Harian
  - Rekap Presensi
- PENILAIAN
  - Dashboard
  - Template
  - Sesi
  - Input Nilai
- POIN KARAKTER
  - Dashboard
  - Input
  - Riwayat
- AKADEMIK LAINNYA
  - Jadwal Pelajaran
  - Mata Pelajaran
  - Kelas
- ADMINISTRASI
  - Guru & Staff
  - Pasukan Khusus
  - Spiritual
  - Tabungan
  - Inventaris
  - Surat
  - Pengumuman
- LAPORAN
  - Laporan
  - Statistik
  - Import & Export
- SISTEM
  - Notifikasi
  - Pengaturan

---

# Navigation Hierarchy

Dashboard

ACADEMIC
- Student Registry
- Students
- Attendance
- Assessment
- Subjects
- Schedule
- Classes

ADMINISTRATION
- Teachers
- Employees
- Inventory
- Letters

REPORTS
- Academic Reports
- Attendance Reports
- Assessment Reports

SYSTEM
- Users
- Roles
- Backup
- Settings

---

# Sidebar States

## Default (Expanded)
- Width: 240px
- Logo + Title + Collapse button visible
- Navigation items show icon + label

## Collapsed
- Width: 64px
- Logo only (centered)
- Logo is clickable to expand
- Collapse button hidden
- Navigation items show icon only
- Tooltip on hover for each item

## Header Behavior
| State | Logo | Title | Collapse Button |
|-------|------|-------|----------------|
| Expanded | Static | Visible | Visible (PanelLeftClose) |
| Collapsed | Clickable | Hidden | Hidden |

## Navigation Item States

### Hover
- Soft background on hover
- Icon color darkens

### Active
- Pill background (radius 18px)
- Primary accent color
- Icon + label visible (expanded) or icon only (collapsed)

## Transition Animation
- Sidebar width: 300ms ease-out
- Content margin adjusts in sync
- Nav item text fades smoothly

---

# Nested Navigation

Use accordion behavior.

Only one section expanded by default.

Remember last expanded section.

---

# Top Navigation

Height: 80px

Contains:
- Global Search
- Academic Year
- Semester
- Notifications
- Quick Create
- User Menu

Sticky at top.

---

# Global Search

Accessible from:
- Search field
- Ctrl + K

Can search:
- Students
- Teachers
- Classes
- Menus
- Reports

---

# Breadcrumb

Display on all pages except Dashboard.

Example:

Dashboard / Students / Detail

Current page is bold.

---

# Tabs

Use for related content within one page.

Examples:
- Profile
- Attendance
- Assessment
- Documents
- Violations

Style:
- Rounded pills
- Radius 18px
- Active uses primary color

---

# Pagination

Always at bottom of data tables.

Features:
- Previous / Next
- Page numbers
- Page size selector
- Total records

---

# User Menu

Contains:
- Profile
- Preferences
- Help
- Sign Out

---

# Notifications

Bell icon with unread badge.

Dropdown includes:
- Academic
- Administration
- System

Newest first.

---

# Mobile

Collapse sidebar into drawer.

Top navigation remains visible.

---

# Interaction

Hover: 200ms ease-out

Focus: visible outline

Active: persistent until route changes

---

# Rules

- Keep labels short.
- Use Lucide icons consistently.
- Do not exceed two navigation levels.
- Every page must be reachable within three clicks.
- Never duplicate navigation in multiple places.
