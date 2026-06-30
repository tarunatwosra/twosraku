# Iconography Guidelines
Version: 1.0

---

# Purpose

This document defines the icon system used throughout the School Information System.

Icons improve recognition, reduce cognitive load, and provide visual consistency.

The entire application must use a single icon library.

---

# Icon Library

Use only:

**Lucide Icons**

Do not mix with:

- Heroicons
- Material Icons
- Bootstrap Icons
- Font Awesome
- Remix Icons
- Tabler Icons

Consistency is more important than icon variety.

---

# Icon Style

Stroke Icons Only

Do not use:

- Filled icons
- Two-tone icons
- 3D icons
- Emoji
- Mixed icon styles

The interface should feel clean and modern.

---

# Stroke Width

Standard

```
2px
```

Do not modify stroke width unless absolutely necessary.

---

# Icon Sizes

Tiny

```
16px
```

Used for:

- Table actions
- Inline labels

---

Default

```
20px
```

Used for:

- Navigation
- Buttons
- Forms

---

Large

```
24px
```

Used for:

- KPI Cards
- Widget headers
- Empty States

---

Extra Large

```
32px
```

Used for:

- Hero Cards
- Large Empty States

---

# Icon Colors

Default

```
Text Secondary
```

Primary Action

```
Primary Blue
```

Success

```
Green
```

Warning

```
Orange
```

Danger

```
Red
```

Muted

```
Gray
```

Never assign random colors.

---

# Navigation Icons

Dashboard

```
LayoutDashboard
```

Students

```
GraduationCap
```

Student Registry

```
BookUser
```

Teachers

```
UserRound
```

Employees

```
Users
```

Classes

```
School
```

Attendance

```
CalendarCheck
```

Assessment

```
ClipboardCheck
```

Subjects

```
BookOpen
```

Schedule

```
CalendarDays
```

Inventory

```
Package
```

Letters

```
Mail
```

Reports

```
BarChart3
```

Settings

```
Settings
```

Users

```
ShieldCheck
```

Backup

```
DatabaseBackup
```

Notifications

```
Bell
```

Help

```
CircleHelp
```

Logout

```
LogOut
```

---

# Common Action Icons

Add

```
Plus
```

Edit

```
Pencil
```

Delete

```
Trash2
```

View

```
Eye
```

Search

```
Search
```

Filter

```
Filter
```

Sort

```
ArrowUpDown
```

Refresh

```
RefreshCw
```

Print

```
Printer
```

Download

```
Download
```

Upload

```
Upload
```

Export

```
FileSpreadsheet
```

Import

```
FolderInput
```

Save

```
Save
```

Copy

```
Copy
```

Duplicate

```
CopyPlus
```

Archive

```
Archive
```

Share

```
Share2
```

---

# Status Icons

Success

```
CircleCheck
```

Warning

```
TriangleAlert
```

Error

```
CircleX
```

Information

```
Info
```

Loading

```
LoaderCircle
```

Pending

```
Clock3
```

Offline

```
WifiOff
```

Online

```
Wifi
```

---

# Form Icons

Calendar

```
Calendar
```

Clock

```
Clock
```

Email

```
Mail
```

Phone

```
Phone
```

Address

```
MapPin
```

Password

```
Lock
```

Show Password

```
Eye
```

Hide Password

```
EyeOff
```

Attachment

```
Paperclip
```

Upload

```
UploadCloud
```

---

# Table Icons

More Actions

```
MoreHorizontal
```

Expand

```
ChevronDown
```

Collapse

```
ChevronUp
```

Next

```
ChevronRight
```

Previous

```
ChevronLeft
```

Sort

```
ArrowUpDown
```

---

# Dashboard Icons

Total Students

```
GraduationCap
```

Teachers

```
UserRound
```

Attendance

```
CalendarCheck
```

Assessments

```
ClipboardCheck
```

Activity

```
Activity
```

Announcement

```
Megaphone
```

Calendar

```
CalendarDays
```

Statistics

```
ChartColumn
```

---

# Empty State Icons

No Data

```
Database
```

No Search Result

```
SearchX
```

No Internet

```
WifiOff
```

Permission Denied

```
ShieldAlert
```

Not Found

```
FileQuestion
```

Folder Empty

```
FolderOpen
```

---

# Icon Placement

Navigation

Left

Buttons

Left of text

Tables

Centered

Status

Left of text

Cards

Top Left

Forms

Leading icon only when necessary.

---

# Icons with Text

Whenever possible

Use icons together with labels.

Avoid icon-only interfaces except for:

- Toolbar
- Table actions
- Navigation collapse

---

# Accessibility

Decorative Icons

```
aria-hidden="true"
```

Interactive Icons

Must include

```
aria-label
```

Example

```
aria-label="Delete Student"
```

---

# Hover States

Hover

Slight color transition

Do not:

Rotate

Bounce

Spin

Unless indicating loading.

---

# Animation

Only loading icons may rotate.

Other icons remain static.

---

# Consistency Rules

Every feature must use the predefined icon.

Example

Attendance

Always

CalendarCheck

Never replace it with Calendar.

Students

Always

GraduationCap

Never alternate with User.

---

# Forbidden Practices

Do not:

Mix icon libraries

Use emoji

Use colored icons without meaning

Randomly resize icons

Rotate icons for decoration

Stretch icons

---

# Success Criteria

A user should recognize every major function by its icon alone.

Icons should become part of the application's visual language.

Consistency is more important than creativity.