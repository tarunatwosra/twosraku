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

Width: 280px

Collapsed Width: 88px

Radius: 32px

Floating with 24px outer margin.

Contains:
- Logo
- School name
- Global search shortcut
- Navigation groups
- User profile
- Collapse button

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

Default

Hover:
- Soft background
- Icon color darkens

Active:
- Pill background
- Primary accent
- Radius 20px
- Smooth transition

Collapsed:
- Icons only
- Tooltip on hover

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
