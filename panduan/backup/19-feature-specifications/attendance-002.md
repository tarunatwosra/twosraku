# Attendance Module (Presensi)
Version: 2.1
Updated: 2026-07-08

**Purpose:** Modul Presensi adalah modul operasional untuk mencatat, memantau, dan melaporkan kehadiran siswa. Menyediakan catatan akurat untuk setiap siswa dan menjadi sumber utama untuk laporan kehadiran, statistik dashboard, dan pemantauan karakter.

**Scope**
- Mengelola: Presensi Harian, Rekapitulasi Kehadiran, Laporan Kehadiran, Statistik Kehadiran.
- Tidak mengelola di sini: Perilaku, Nilai, Disiplin (modul terpisah).

**Tujuan Utama:** mencatat kehadiran dengan akurat; mencegah duplikat; menyediakan statistik kehadiran; mendukung pelaporan; berintegrasi dengan Dashboard dan Poin Karakter.

**Supported Users**
| Role | Access |
|---|---|
| Administrator | Full Access |
| Homeroom Teacher | Own Classes |
| Teacher | Read Only |
| Staff | Read Only |
| Principal | Read Only |

**Dependencies:** Student Registry, Academic Calendar, Class, Settings (Tahun Ajaran & Semester). Kehadiran tidak bisa ada tanpa siswa aktif.

**Navigasi:** Main Navigation → Presensi. Sub-pages: Input Presensi, Rekap, Laporan.

---

## Alur Presensi (Simplified)

```
┌─────────────────────────────────────────────────────────┐
│                    HALAMAN UTAMA                         │
│   /presensi                                             │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │  📅 Tanggal: [ 08 Juli 2026  ] ◀ ▶             │   │
│   │  🏫 Kelas: [ X TKJ 1        ▼ ]                 │   │
│   │  [ Ambil Presensi ]                              │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              HALAMAN INPUT PRESENSI                      │
│   /presensi/input                                      │
│                                                         │
│   Card Header: Navigasi Tanggal | Pilih Kelas | Submit │
│   ───────────────────────────────────────────────────   │
│   Card Summary: Total | Hadir | Sakit | Izin | Alpa    │
│   ───────────────────────────────────────────────────   │
│   Card Filter: [Semua] [Sakit] [Izin] [Alpa]         │
│   ───────────────────────────────────────────────────   │
│   Table: No | NIS | Nama | JK | Status Toggle          │
│   ───────────────────────────────────────────────────   │
│   Bulk Actions: [Sakit] [Ijin] [Alpa] | Select All   │
└─────────────────────────────────────────────────────────┘
```

---

## Attendance Status (HSIA)

| Code | Status | Warna | Deskripsi |
|------|--------|-------|-----------|
| H | Hadir | Green `#22C55E` | Siswa hadir normal |
| S | Sakit | Orange `#F59E0B` | Absen karena sakit |
| I | Ijin | Cyan `#06B6D4` | Izin resmi |
| A | Alpa | Red `#EF4444` | Alpha (absen tanpa keterangan) |

**Catatan:** Status Terlambat (T) dihapus dari alur. Default semua siswa = Hadir.

---

## Halaman-halaman

### 1. Halaman Utama (`/presensi`)

**Layout Structure:**
```
<div className="space-y-6">
  <Card className="p-6">         ← Header Card (tanggal + kelas)
  <div className="grid...">     ← Quick Actions Cards
  <Card className="p-0">       ← Class List Table
  <Card className="p-6">        ← Recent Activity
</div>
```

**Components:**
- Tanggal picker dengan navigasi ◀ ▶
- Dropdown pilih kelas
- Tombol "Ambil Presensi"
- Quick stats cards (Rekapitulasi, Hadir, Alpa)
- Statistik kehadiran per kelas dengan StatusBadge

### 2. Input Presensi (`/presensi/input`)

**Layout Structure:**
```
<div className="space-y-6">
  <Card className="p-4">        ← Header Bar Card
  <Card className="p-5">        ← Summary Pills Card
  <Card className="p-4">        ← Filter Tabs Card
  <Card className="p-0">        ← Attendance Table
</div>
```

**Header Bar Components:**
- Back link
- Date navigation (◀ [date] ▶)
- Class selector dropdown
- Submit button

**Summary Pills:**
- Total Siswa dengan icon
- StatPills: Hadir | Sakit | Izin | Alpa
- Persentase kehadiran (large number)

**Filter Tabs:**
- Pill-style tabs: [Semua] [Sakit] [Izin] [Alpa]
- Active state dengan warna sesuai status
- Count badge per tab

**Bulk Actions:**
- Tampilkan hanya jika ada siswa dipilih
- [Tandai Sakit] [Tandai Izin] [Tandai Alpa]
- [Pilih Semua] [Batal]

**Attendance Table:**
| Kolom | Styling |
|-------|---------|
| Checkbox | w-12, accent primary |
| No | text-sm text-muted |
| NIS | text-sm font-mono |
| Nama | text-sm font-medium |
| JK | text-center text-sm |
| Status | 4 buttons H S I A |

### 3. Rekapitulasi (`/presensi/rekap`)

**Layout Structure:**
```
<div>
  <Card className="p-4 mb-4">   ← Header Bar Card
  <div className="space-y-6">
    <div className="grid...">   ← Stats Grid (5 cards)
    <Card className="p-0">    ← Recap Table
    <Card className="p-6">    ← Trend Chart
  </div>
</div>
```

**Header Bar:**
- Date navigation
- View Mode toggle (Harian | Mingguan | Bulanan)
- Cetak & Export buttons

**View Modes:**
- **Harian:** Rekap per kelas untuk tanggal tersebut
- **Mingguan:** 7 hari, show/hide weekend
- **Bulanan:** Semua hari efektif (scrollable table)

**Stats Grid (5 cards):**
- Total Siswa
- Hadir (dengan %)
- Sakit
- Izin
- Alpa

**Recap Table:**
- Header dengan title + percentage
- Row per kelas dengan class icon
- Action button untuk edit

**Trend Chart:**
- Bar chart 7 hari terakhir
- Color coding: hijau ≥90%, kuning ≥75%, merah <75%

### 4. Detail Kelas (`/presensi/kelas/[id]`)

**Layout Structure:** (sama dengan Input Presensi)

```
<div className="space-y-6">
  <Card className="p-4">        ← Header Card (back + date + class)
  <Card className="p-5">        ← Summary Pills Card
  <Card className="p-4">        ← Filter Tabs Card
  <Card className="p-0">        ← Attendance Table
</div>
```

---

## UI Design Patterns & Standards

### Card Wrappers

**Standard Card:**
```tsx
<Card className="p-5">
  {/* Content */}
</Card>
```

**Header Card:**
```tsx
<Card className="p-4">
  <div className="flex items-center justify-between gap-4">
    {/* Content */}
  </div>
</Card>
```

**Table Card:**
```tsx
<Card className="overflow-hidden p-0">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* Table content */}
    </table>
  </div>
</Card>
```

### Spacing System

| Element | Spacing |
|---------|---------|
| Section gap | `space-y-6` |
| Card internal | `p-4` atau `p-5` |
| Component gap | `gap-4` |
| Divider | `h-10 w-px bg-[var(--border-light)]` |

### Typography Hierarchy

| Element | Classes |
|---------|---------|
| Section title | `text-lg font-semibold` |
| Subtitle | `text-sm text-[var(--text-muted)]` |
| Table header | `text-xs font-medium uppercase tracking-wide` |
| Body text | `text-sm` |
| Stat value | `text-xl font-bold` / `text-3xl font-bold` |

### Navigation Buttons

```tsx
// Date navigation
<Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-lg">
  <ChevronLeft className="w-5 h-5" />
</Button>
```

### Status Badge (HSIA)

```tsx
// Success (Hadir)
<div className="bg-[var(--success-soft)] text-[var(--success)]">
  <span className="text-lg font-bold">{value}</span>
  <span className="text-xs font-medium">Hadir</span>
</div>

// Warning (Sakit)
// bg-[var(--warning-soft)] text-[var(--warning)]

// Info (Izin)
// bg-[var(--info-soft)] text-[var(--info)]

// Danger (Alpa)
// bg-[var(--danger-soft)] text-[var(--danger)]
```

### Status Toggle (Table)

```tsx
// Active state
<div className="bg-[var(--success)] text-white">H</div>

// Inactive state
<div className="bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white">
  H
</div>

// Row highlight berdasarkan status
// Sakit: bg-[var(--warning-soft)]/30
// Izin: bg-[var(--info-soft)]/30
// Alpa: bg-[var(--danger-soft)]/30
```

### Filter Tabs

```tsx
<div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-full">
  <button className="px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm">
    Semua
  </button>
  <button className="px-4 py-2 rounded-full text-sm font-medium text-[var(--text-muted)]">
    Sakit
  </button>
</div>

// Active with color
<button className="px-4 py-2 rounded-full bg-[var(--warning)] text-white">
  Sakit
</button>
```

---

## Data Features

### Realistic Dummy Data

**Student Distribution per Day:**
- Senin: Alpha lebih banyak (3-5%)
- Jumat: Izin lebih banyak (3-5%)
- Normal: Distribusi standar (Alpha 1-2%, Izin 2-3%, Sakit 2-4%)

**Weekend Handling:**
- Sabtu/Minggu = tidak ada sekolah
- Skip di weekly & monthly recap

### Print Feature

```tsx
const handlePrint = () => {
  window.print()
}
```

**Print CSS:**
```css
@media print {
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
}
```

### Export Feature

**CSV Export:**
- Daily: Header + Summary + Per-Kelas Table
- Weekly: Header + Daily breakdown
- Monthly: Header + Daily breakdown

**Filename:** `presensi_{viewMode}_{date}.csv`

---

## Business Rules

| Rule | Description |
|------|-------------|
| No Duplicates | Satu record per siswa per tanggal |
| No Future Date | Tidak bisa presensi untuk tanggal mendatang |
| No Edit After Lock | Tidak bisa edit setelah periode ditutup |
| Archived Student | Siswa tidak aktif tidak bisa di-presensi |
| Default = Hadir | Semua siswa default Hadir |
| Weekend Skip | Weekend tidak dihitung di weekly/monthly |

---

## Performance Requirements

- Support 100,000+ records via pagination
- Server-side filtering/search
- Lazy loading untuk tabel besar
- Optimized indexing

---

## Accessibility

- Keyboard Navigation
- Visible Focus
- Accessible Tables
- ARIA Labels
- High Contrast
- Reduced Motion

---

## Responsive Behavior

| Device | Layout |
|---------|--------|
| Desktop | Full Table |
| Tablet | Horizontal Scroll |
| Mobile | Card Layout |

---

## Security

- Soft delete (tidak hapus permanen)
- Every modification logged
- Role-based permissions mandatory

---

## Integrasi

### Dashboard
- Kehadiran hari ini
- Tren kehadiran
- Persentase kehadiran
- Distribusi per kelas

### Poin Karakter
- Alpha ≥ 3x per bulan → Suggested Character Review
- Poin karakter tetap manual approval

---

## Empty / Loading / Error States

### Loading
- Skeleton table rows (10 items)
- Skeleton stat cards
- Match layout dengan komponen

### Empty
- Icon centered (48-64px)
- Title + description
- Primary action button

### Error
- Clear, non-technical messages
- Retry button

---

## Keyboard Shortcuts (Enhancement)

| Key | Action |
|-----|--------|
| 1 | Hadir |
| 2 | Sakit |
| 3 | Ijin |
| 4 | Alpa |
| A | Select All |
| S | Save |

---

## Files Structure

```
app/presensi/
├── page.tsx                    # Halaman utama
├── input/page.tsx             # Input presensi
├── rekap/page.tsx             # Rekapitulasi
└── kelas/[id]/page.tsx        # Detail kelas

hooks/
└── useAttendance.ts           # Attendance hooks (useAttendance, useAttendanceRecap)

types/
└── attendance.ts             # TypeScript types

panduan/
└── 19-feature-specifications/
    └── attendance.md          # Panduan ini
```

---

## Definition of Done

Selesai jika:
- [x] mencatat kehadiran dengan akurat
- [x] default semua Hadir
- [x] mendukung bulk actions
- [x] filter tab berfungsi
- [x] menyediakan laporan rekap (harian/mingguan/bulanan)
- [x] fitur print & export
- [x] berintegrasi dengan Dashboard
- [x] responsive layout
- [x] audit history
- [x] mengikuti Design System

---

## Final Principle

Presensi adalah salah satu modul yang paling sering digunakan di Twosraku. Modul ini harus mengutamakan kecepatan, kesederhanaan, dan keandalan. Default Hadir meminimalkan input data - guru hanya perlu mengubah siswa yang tidak hadir.

---

Last Updated: 2026-07-08 | Version: 2.1
# End of Attendance Module
