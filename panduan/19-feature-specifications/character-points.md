# Character Points Module (Poin Karakter) — Compact
Version: 3.0

**Purpose:** Character Points is a character development engine recording, evaluating, and monitoring student behavior throughout their educational journey. Unlike traditional disciplinary systems, it recognizes both positive and negative behaviors — the goal is continuous character growth, not merely punishing misconduct.

**Philosophy:** character is built through consistency. Every recorded behavior contributes to a student's character profile. Positive behavior receives recognition; negative behavior triggers guidance and improvement. Records should support education rather than punishment.

**Primary Objectives:** promote positive behavior; monitor disciplinary issues; provide transparent character history; support counseling; provide data for reports and dashboard; integrate with Student Registry.

**Scope:** Character Categories, Behavior Types, Character Records, Reward Records, Violation Records, Counseling Records, Character Statistics, Reports, Analytics, Dashboard Integration.

**Core Architecture:** Character Category → Behavior Type → Character Event → Student → Character Record → Character Summary.

---

## Halaman & Fitur

### 1. Dashboard (`/poin-karakter`)

**Layout:**
- Quick Actions (Input Poin, Riwayat, Pengaturan)
- Statistics Cards (Poin Positif, Poin Negatif, Total Catatan, Net Poin)
- Leaderboards (Siswa Berprestise, Perlu Perhatian)
- Charts (Trend 30 Hari, Breakdown per Kategori)
- Kategori Karakter Grid
- Recent Behaviors (Positif & Negatif)

**Components:**
- `CharacterStatCard` - Kartu statistik dengan trend indicator
- `StudentLeaderboard` - Leaderboard dengan medal styling
- `PointTrendChart` - Line chart untuk trend poin
- `CategoryBreakdownChart` - Pie chart untuk breakdown kategori
- `CategoryGrid` - Grid card untuk kategori
- `BehaviorCard` - Card untuk menampilkan perilaku

### 2. Input Poin (`/poin-karakter/input`)

**Konsep:** Form step-by-step dengan 3 langkah:

**Step 1: Pilih Siswa**
- Search input dengan dropdown autocomplete
- Menampilkan nama, kelas, dan NISN
- Single student selection

**Step 2: Pilih Perilaku**
- Filter: Semua / Positif / Negatif
- Filter: Kategori (horizontal scroll chips)
- Search perilaku
- Grid card behaviors dengan checkbox
- Real-time calculation total poin

**Step 3: Detail & Simpan**
- Summary card dengan student info
- List perilaku yang dipilih
- Input keterangan (opsional)
- Total poin dengan warna kontekstual
- Tombol Simpan

**Components:**
- `StudentSearchInput` - Input dengan autocomplete
- `BehaviorCard` - Card perilaku dengan selection state
- `PointSummary` - Summary card dengan total

### 3. Pengaturan (`/poin-karakter/setting`)

**Tabs:**
1. **Kategori** - CRUD kategori karakter
2. **Perilaku** - CRUD tipe perilaku
3. **Pengaturan** - Konfigurasi umum

**Kategori Tab:**
- Grid card dengan icon, warna, dan status
- Modal untuk create/edit
- Color picker palette
- Badge untuk jumlah perilaku

**Perilaku Tab:**
- Grouped by category
- Inline edit dan delete buttons
- Badge untuk arah (positif/negatif) dan poin
- Severity badge

**Pengaturan Tab:**
- Batas poin untuk rekomendasi konseling
- Default poin untuk perilaku positif/negatif

### 4. Riwayat (`/poin-karakter/riwayat`)

(Halaman existing - dapat diintegrasikan dengan komponen baru)

---

## Core Concepts

### Character Category
- **Properties:** Name, Description, Color, Icon, Status, Display Order
- **Default Categories:** Disiplin, Tanggung Jawab, Kepemimpinan, Sopan Santun, Integritas, Kerja Tim, Kehadiran, Penampilan
- **UI:** Color picker dengan predefined palette, icon auto-mapping

### Behavior Type
- **Properties:** Category, Name, Description, Point Value, Positive/Negative, Severity, Requires Approval, Requires Counseling, Status
- **Severity Levels:** Minor, Moderate, Major, Critical
- **Direction:** Positive (+), Negative (-)
- **UI:** Toggle arah, input poin, severity select

### Character Record
- **Properties:** Student, Behavior Type, Event, Date, Reporter, Description, Evidence, Status, Remarks
- **Evidence (optional):** Photo, PDF, Video (future)
- **Record Status:** Draft → Submitted → Reviewed → Approved → Archived

### Character Summary
Each student automatically has: Positive/Negative Points, Net Score, Total/Positive/Negative Records, Highest Achievement, Most Frequent Violation, Recent Activities, Character Trend.
**Formula:** Net Score = Positive Points − Negative Points.

---

## Navigation Structure

```
POIN KARAKTER
├── Dashboard (/poin-karakter)
├── Input Poin (/poin-karakter/input)
├── Pengaturan (/poin-karakter/setting)
│   ├── Kategori
│   ├── Perilaku
│   └── Pengaturan
└── Riwayat (/poin-karakter/riwayat)
```

---

## Components Library

| Component | Location | Description |
|-----------|----------|-------------|
| `CharacterStatCard` | `components/poin-karakter/stat-card.tsx` | Kartu statistik dengan trend |
| `StudentLeaderboard` | `components/poin-karakter/student-leaderboard.tsx` | Leaderboard dengan medal |
| `CategoryGrid` | `components/poin-karakter/category-grid.tsx` | Grid untuk kategori |
| `BehaviorCard` | `components/poin-karakter/behavior-card.tsx` | Card perilaku |
| `StudentSearchInput` | `components/poin-karakter/student-search-input.tsx` | Input pencarian siswa |
| `PointSummary` | `components/poin-karakter/point-summary.tsx` | Summary dengan total poin |
| `PointTrendChart` | `components/poin-karakter/charts.tsx` | Line chart trend |
| `CategoryBreakdownChart` | `components/poin-karakter/charts.tsx` | Pie chart breakdown |

---

## Business Rules

1. Every record must reference an existing student
2. Point values determined by Behavior Type
3. Users may not manually modify point values during recording
4. Character history must remain immutable
5. Historical records cannot be deleted
6. Negative points ≥ threshold → Counseling Recommendation

---

## Permissions

| Role | Access |
|------|--------|
| Administrator | Full Access |
| Vice Principal | Full Access |
| Counselor | Review |
| Teacher | Create Records |
| Homeroom Teacher | View Own Students |
| Staff | Read |
| Students | No Access |

---

## Design System Tokens (v2.0)

| Token | Value |
|-------|-------|
| Primary | `#4F7CFF` |
| Success | `#22C55E` |
| Danger | `#EF4444` |
| Warning | `#F59E0B` |
| Border Radius Card | `28px` |
| Border Radius Button | `18px` |
| Border Radius Input | `18px` |
| Animation | `200ms ease-out` |

---

## Future Enhancements

- AI Behavior Analysis
- Behavior Prediction
- Parent Notifications
- Mobile Reporting
- QR Event Recording
- Teacher Mobile App
- Badge System
- Achievement Levels
- Behavior Timeline
- Student Portfolio
- Gamification
- House Point System
- Dormitory Management

---

## Definition of Done

Complete when: positive and negative behaviors supported; character history traceable; reports reproducible; permissions enforced; dashboard integration works; performance targets achieved; accessibility standards satisfied; follows the Design System.

---

## Final Principle

Character Points is not a punishment system — it is a student character development platform. Every recorded behavior should help teachers understand, guide, and develop students into individuals with strong discipline, responsibility, leadership, and integrity.

---

# Changelog

## v3.0 (2026-08-14)
- Complete refactor with modern UI/UX
- Added Setting page with Categories & Behaviors management
- Added step-by-step input flow
- Added charts (trend, breakdown)
- Added reusable components library
- Updated sidebar navigation
- Follows ANTISLOP design principles

## v2.0
- Initial structured version

## v1.0
- Basic character points

---
# End of Character Points Module (v3.0)
