# Dashboard
Version: 2.0

# Purpose

The Dashboard is the application's home page.

It should provide a clear overview of school operations, highlight important information, and allow users to quickly access their most common tasks.

The dashboard is not a reporting page. It is a decision-support and productivity page.

---

# Design Goals

The dashboard should feel:

- Premium
- Calm
- Data-first
- Action-oriented
- Spacious
- Easy to scan within 5 seconds
- Tab-organized for reduced cognitive load

Avoid clutter.

---

# Information Priority

1. Greeting & Context
2. Tab Navigation
3. KPI Summary (context-aware based on tab)
4. Important Actions
5. Operational Status
6. Analytics

---

# Page Structure

1. Header (with school info and quick actions)
2. Tab Navigation (Ringkasan | Akademik | Keuangan | Karakter)
3. KPI Cards (tab-specific content)
4. Quick Actions
5. Main Content (tab-specific widgets)
6. Activity Timeline

---

# Tab Navigation

Dashboard uses tab-based navigation to reduce information overload:

| Tab | KPI Cards | Main Content |
|-----|-----------|--------------|
| Ringkasan | Total Siswa, Guru, Presensi, Penilaian | Attendance Trend, Assessment Progress |
| Akademik | Total Siswa, Guru, Presensi, Penilaian | Charts, Notifications, Schedule |
| Keuangan | Tabungan, Setoran, Penarikan | Savings Overview, Student Distribution |
| Karakter | Balance, Poin+, Poin-, Unit Khusus | Character Visualization, Balance Widget |

Tab Design:
- Pill-style tabs with rounded background
- Active: Primary blue background, white text
- Inactive: Transparent background, muted text
- Icon + Label for each tab
- Smooth transition between tabs

Example:
```tsx
<div className="flex items-center gap-2 p-1 bg-surface-secondary rounded-[18px] w-fit">
  <button className="flex items-center gap-2 px-4 py-2 rounded-[14px] bg-primary text-white">
    <LayoutGrid className="w-4 h-4" />
    Ringkasan
  </button>
  {/* ... other tabs */}
</div>
```

---

# Header

Contains:
- School name, academic year, semester
- Global search
- Refresh button

---

# KPI Cards

Display four primary metrics per tab.

Rules:
- Large number (text-stat-lg)
- Small description
- Optional trend
- Simple icon
- Equal width
- Skeleton loading state when data is loading

---

# Main Analytics

Use two-column layout for most tabs.

Content varies by tab - see Tab Navigation section above.

Charts should be simple and readable.

---

# Loading States

All dashboard widgets must support skeleton loading states.

Use KPICardSkeleton, ChartSkeleton, WidgetSkeleton components.

Example:
```tsx
{loading ? (
  <div className="grid grid-cols-4 gap-[24px]">
    {Array.from({ length: 4 }).map((_, i) => (
      <KPICardSkeleton key={i} />
    ))}
  </div>
) : (
  <KPICards />
)}
```

---

# Empty States

Every widget must support:
- Empty state
- Loading state
- Error state

Use EmptyState components with actionable feedback.

Example error state:
```tsx
<EmptyState
  icon={AlertCircle}
  title="Gagal memuat data"
  description="Pastikan koneksi internet stabil dan coba lagi."
  action={{ label: "Coba Lagi", onClick: handleRetry }}
/>
```

---

# Error Handling

Error messages should be:
- Specific about what failed
- Actionable (provide retry button)
- Informative (explain what to do)

Good: "Gagal memuat data presensi. Pastikan koneksi internet stabil."
Bad: "Error"
