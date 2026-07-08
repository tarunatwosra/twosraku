# Assessment Module (Penilaian)
Version: 5.0

## Part 1 — Purpose & Architecture

**Purpose:** Sistem penilaian terpusat dengan konsep Kategori, Periode, Item, Formula, dan Nilai Rapor. Mendukung konversi otomatis dan integrasi dengan modul lain.

**Implementation Status:** ✅ IMPLEMENTED (v7.0)
- **Database:** Supabase (PostgreSQL) - Migration 005
- **Hooks:** `useAssessmentNew.ts`, `useAssessmentCategory()`, `usePeriodScoring()`
- **UI Pages:** Assessment Center, Category Detail, Formula, **Quick Score** (input nilai dipindahkan ke Quick Score)
- **Data Source:** Semua data dari Supabase (kategori, periode, item, kelas, siswa, nilai)
- **Features:** Template presets (3 templates), Inline item creation, Table-based input, Filter Kelas, Hasil kategori column

**Core Concepts:**
- **Kategori** — Jenis penilaian (Jasmani Taruna, PBB, dll). Bisa dinilai berkali-kali.
- **Item** — Komponen input (Push Up, Sit Up, Lari). Setiap item punya konversi otomatis.
- **Periode** — Instance ke-N dari kategori (Januari, April, Juli, Oktober). Setiap periode punya bobot.
- **Nilai Kategori** — Hasil akhir dari 1 kategori = jumlah(periode × bobot)
- **Formula** — Kombinasi beberapa Nilai Kategori +/atau modul lain
- **Nilai Rapor** — Penjumlahan semua Formula

**Entity Relationship:**
```
Kategori (1→∞) Item
Kategori (1→∞) Periode (1→∞) PeriodScores (→ Nilai Kategori)
Formula (1→∞) Nilai Kategori + Modul Konversi
Nilai Rapor = Σ Formula
```

---

## Part 2 — Database Schema (Supabase)

### Entity Overview

```
┌─────────────────────┐
│ assessment_categories│  ← Jenis penilaian (Jasmani, PBB)
└────────┬────────────┘
         │
         ├──── 1:N ────► assessment_items (Push Up, Sit Up, dll)
         │                    │
         │                    ├── input_type (number, count, time, boolean)
         │                    ├── conversion_type (direct, multiply, lookup_table)
         │                    └── conversion_value (×2.5, atau JSON table)
         │
         └──── 1:N ────► assessment_periods (Jan, Apr, Jul, Okt)
                              │
                              └── weight_percentage (25%, 25%, 25%, 25%)

┌─────────────────────┐
│ assessment_period_  │  ← Nilai per siswa per item
│ scores             │
└────────────────────┘

┌─────────────────────┐
│ assessment_category_│  ← Nilai akhir kategori
│ scores             │     = Σ(periode × bobot)
└────────────────────┘

┌─────────────────────┐
│ assessment_formulas │  ← Formula = kombinasi Nilai Kategori + modul
│                     │     Contoh: Jasmani 50% + Kehadiran 20%
└────────────────────┘

┌─────────────────────┐
│ assessment_rapor    │  ← Nilai Rapor = Σ Formula
└────────────────────┘
```

---

## Part 3 — Tables

### Table: assessment_categories

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | varchar | Nama kategori (unique) |
| description | text | Deskripsi |
| icon | varchar | Nama ikon |
| color | varchar | Kode warna hex |
| display_order | int | Urutan tampil |
| status | varchar | active, inactive |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

### Table: assessment_items

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| category_id | uuid | FK ke assessment_categories |
| name | varchar | Nama item |
| description | text | Deskripsi |
| input_type | varchar | number, count, time, percentage, boolean |
| conversion_type | varchar | direct, multiply, lookup_table |
| conversion_value | text | Nilai konversi (×2.5 atau JSON table) |
| score_min | numeric | Skor minimum |
| score_max | numeric | Skor maksimum |
| weight | numeric | Bobot dalam periode |
| display_order | int | Urutan tampil |
| is_required | boolean | Wajib diisi |
| status | varchar | active, inactive |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

### Table: assessment_periods

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| category_id | uuid | FK ke assessment_categories |
| period_name | varchar | Nama periode (Januari 2026) |
| period_order | int | Urutan periode |
| start_date | date | Tanggal mulai |
| end_date | date | Tanggal selesai |
| weight_percentage | decimal | Bobot (0-100%) |
| status | varchar | active, inactive |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

### Table: assessment_period_scores

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| period_id | uuid | FK ke assessment_periods |
| student_id | uuid | FK ke students |
| item_id | uuid | FK ke assessment_items |
| raw_input | text | Input asli (35, 12:30) |
| converted_score | decimal | Nilai setelah konversi |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

**Unique Constraint:** (period_id, student_id, item_id)

### Table: assessment_category_scores

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | FK ke students |
| category_id | uuid | FK ke assessment_categories |
| academic_year_id | uuid | FK ke academic_years |
| semester_id | uuid | FK ke semesters |
| total_score | decimal | Nilai total kategori |
| grade | varchar | Grade huruf |
| calculated_at | timestamptz | Waktu kalkulasi |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

**Unique Constraint:** (student_id, category_id, academic_year_id, semester_id)

### Table: assessment_formulas

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | varchar | Nama formula |
| description | text | Deskripsi |
| academic_year_id | uuid | FK ke academic_years |
| semester_id | uuid | FK ke semesters |
| components | jsonb | [{"type": "category", "id": "xxx", "weight": 50}, ...] |
| total_weight | decimal | Total bobot (harus 100%) |
| status | varchar | active, inactive |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

### Table: assessment_rapor

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | FK ke students |
| academic_year_id | uuid | FK ke academic_years |
| semester_id | uuid | FK ke semesters |
| formulas | jsonb | {"formula_id": score, ...} |
| formula_values | jsonb | {"formula_id": {"name": "F1", "score": 85, "weight": 50}} |
| total_score | decimal | Total semua formula |
| grade | varchar | Grade huruf |
| status | varchar | draft, calculated, final |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

**Unique Constraint:** (student_id, academic_year_id, semester_id)

### Table: attendance_conversion_rules

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | varchar | Nama aturan |
| description | text | Deskripsi |
| source_field | varchar | attendance_rate, total_present, dll |
| lookup_table | jsonb | {"100": 100, "95": 95, "90": 90, ...} |
| status | varchar | active, inactive |
| created_at | timestamptz | Timestamp dibuat |
| updated_at | timestamptz | Timestamp update |

---

## Part 4 — Input Types & Conversion

### Input Types

| Input Type | Contoh Input | Penjelasan |
|------------|--------------|------------|
| number | 85 | Input langsung angka |
| count | 35 push up | Jumlah fisik (push up, sit up) |
| time | 12:30 | Waktu (menit:detik) |
| percentage | 90 | Persentase (0-100) |
| boolean | Ya/Tidak | Input Ya atau Tidak |

### Conversion Types

| Conversion Type | Rumus | Contoh |
|----------------|-------|--------|
| direct | Nilai = Input | Input 85 → Nilai 85 |
| multiply | Nilai = Input × konstanta | Input 35 × 2.5 = 87.5 |
| lookup_table | Nilai = lihat di tabel | Input 12:30 → 85 |

### Contoh Konversi

```
Item: Push Up
- input_type: count
- conversion_type: multiply
- conversion_value: 2.5
- Input: 35 push up
- Konversi: 35 × 2.5 = 87.5

Item: Lari 2.4km
- input_type: time
- conversion_type: lookup_table
- conversion_value: {"10:00": 100, "11:00": 90, "12:00": 80, ...}
- Input: 12:30
- Konversi: 80 (lookup table)
```

---

## Part 5 — Grading Scale

```typescript
const DEFAULT_GRADING_SCALE = [
  { grade: "A", minScore: 90, maxScore: 100, description: "Sangat Baik", color: "#22C55E", isPassing: true },
  { grade: "B", minScore: 80, maxScore: 89, description: "Baik", color: "#3B82F6", isPassing: true },
  { grade: "C", minScore: 70, maxScore: 79, description: "Cukup", color: "#F59E0B", isPassing: true },
  { grade: "D", minScore: 60, maxScore: 69, description: "Kurang", color: "#F97316", isPassing: true },
  { grade: "E", minScore: 0, maxScore: 59, description: "Sangat Kurang", color: "#EF4444", isPassing: false },
]
```

---

## Part 6 — Hooks (useAssessmentNew.ts)

### Main Hook: useAssessmentNew()

```typescript
const {
  // Data
  categories, items, periods, formulas, conversionRules,
  
  // State
  loading, error, statistics,
  
  // CRUD - Categories
  createCategory, updateCategory, deleteCategory,
  
  // CRUD - Items
  createItem, updateItem, deleteItem,
  
  // CRUD - Periods
  createPeriod, updatePeriod, deletePeriod,
  
  // CRUD - Formulas
  createFormula, updateFormula, deleteFormula,
  
  // Scoring
  fetchPeriodScores, savePeriodScore,
  
  // Calculations
  calculateItemScore, calculateCategoryScoreValue,
  convertAttendanceToScore, getGrade,
  
  // Refresh
  refresh,
} = useAssessmentNew()
```

### Category Detail Hook: useAssessmentCategory(categoryId)

```typescript
const {
  category, items, periods, totalPeriodWeight, loading,
  createItem, updateItem, deleteItem,
  createPeriod, updatePeriod, deletePeriod,
  calculateItemScore, getGrade,
  refresh,
} = useAssessmentCategory("category-id")
```

### Period Scoring Hook: usePeriodScoring(periodId, categoryId)

```typescript
const {
  period, items, scores, students,
  loading, getScore, getStudentPeriodAverage,
  handleSaveScore, getGrade, calculateItemScore,
  refresh,
} = usePeriodScoring("period-id", "category-id")
```

---

## Part 7 — UI Design Patterns

**Referensi:** UI modul penilaian mengikuti design patterns dari Buku Induk (`student-registry.md`).

### 1. Category Card (Daftar Kategori)
- **Variant:** Elevated Card dengan gradient decoration
- **Avatar:** Menggunakan warna kategori (`${category.color}20`)
- **Header:** Gradient decoration transparan di pojok kanan atas
- **Stats:** Quick stats dalam pill-style containers
- **Expanded Content:** Items dan periods dalam grid layout

### 2. Item/Period Card (Detail Kategori)
- **Variant:** Soft background dengan hover border
- **Actions:** Edit/Delete muncul pada hover (opacity transition)
- **Weight Progress:** Progress bar dengan animasi dan warna dinamis

### 3. Student Card (Input Nilai)
- **Avatar:** Avatar dengan inisial nama siswa
- **Grade Badge:** Rounded badge dengan warna berdasarkan grade
- **Expandable:** ChevronDown untuk expand/collapse
- **Input Fields:** Rounded inputs dengan preview konversi

### 4. Formula Card
- **Header:** Gradient decoration + icon dalam rounded container
- **Components:** List dengan icon type (category/module)
- **Weight Summary:** Progress bar + status indicator

### 5. Stat Pills (Stats Bar)
- **Style:** Flex container dengan rounded-full
- **Variants:** default, success, warning, danger
- **Labels:** Text uppercase tracking-wide

### 6. Modal Styling
- **Container:** Rounded-3xl dengan backdrop blur
- **Header:** Gradient decoration + icon container
- **Body:** Spacing 5 dengan form fields
- **Footer:** Sticky dengan background subtle

### 7. Empty States
- **Icon:** Large (w-20 h-20) dalam rounded-3xl container
- **Title:** Text-lg font-semibold
- **Description:** Text-sm text-muted
- **Action:** Primary button centered

### 8. Form Fields
- **Input Height:** h-12 (48px)
- **Border Radius:** Rounded-2xl
- **Background:** var(--surface-secondary)
- **Focus:** Ring-2 dengan opacity rendah

---

## Part 8 — UI Pages

### Navigation Structure

```
Penilaian
├── Pusat Penilaian    (/penilaian)
├── Input Nilai Cepat (/penilaian/quick)
├── Hasil Penilaian  (/penilaian/hasil)
└── Formula         (/penilaian/formula)
```

### Halaman: Pusat Penilaian (/penilaian)

**Fitur:**
- Daftar kategori dengan expandable cards
- Preview item dan periode
- Quick stats (total kategori, periode, item, formula)
- Filter pencarian
- Create/Edit/Delete kategori
- **Template selector di modal Kategori Baru**
- Referensi grading scale

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [🔍 Cari...]  [Filter]  [Kelola Formula] [+ Kategori] │
├─────────────────────────────────────────────────────┤
│ [📊 12] [📅 48] [🎯 120] [📐 4]  ← Stat Cards     │
├─────────────────────────────────────────────────────┤
│ ┌─ Category Card (Elevated + Gradient) ─────────────┐│
│ │ [Avatar] Nama Kategori        [Stats] [Actions] ││
│ │ Description...                    ▼             ││
│ ├─ Expanded ─────────────────────────────────────┤│
│ │ Periode: [Jan] [Apr] [Jul] [Okt]              ││
│ │ Items: [Push Up] [Sit Up] [Pull Up]...        ││
│ └────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ ┌─ Referensi Sistem Penilaian ────────────────────┐│
│ │ [A] [B] [C] [D] [E]                         ││
│ └────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### NEW: Quick Score Page (/penilaian/quick)

**Tujuan:** Input nilai cepat tanpa setup rumit. Langsung pilih kategori → periode → kelas → input.

**Fitur:**
- Filter 3 level: Kategori → Periode → Kelas
- Preview item yang akan dinilai
- **Tambah item baru inline** (tanpa ke halaman lain)
- Input nilai dalam **format tabel** (bukan card expandable)
- Preview konversi real-time di bawah setiap input
- **Kolom hasil kategori** di sebelah kanan tabel
- **1 tombol Simpan Semua** (tidak ada simpan per siswa)
- Stats pills (total siswa, rata-rata, tertinggi, terendah)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Pilih Kategori, Periode & Kelas                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [Kategori ▼] | [Periode ▼] | [Kelas ▼]                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Item: [Push Up ×2.5] [Sit Up ×2] [Pull Up ×5] [+ Tambah Item]               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ [Total: 30] [Rata: 82.3] [Tertinggi: 95] [Terendah: 65]  [Simpan Semua]    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Cari...]                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┬───────────────────┐  │
│ │ TABLE INPUT                                          │ HASIL KATEGORI   │  │
│ │ ┌──┬──────────┬─────────┬─────────┬─────────┬───────┐│                   │  │
│ │ │No│Nama      │Push Up  │Sit Up   │Pull Up │...    ││   ┌─────────┐   │  │
│ │ │  │          │[35___]  │[40___]  │[5___]  │       ││   │ 85.5 B  │   │  │
│ │ │  │          │→ 87     │→ 80     │→ 25     │       ││   └─────────┘   │  │
│ │ │  │          │         │         │         │       ││                   │  │
│ │ ├──┼──────────┼─────────┼─────────┼─────────┼───────┤│   ┌─────────┐   │  │
│ │ │  │          │[30___]  │[35___]  │[3___]   │       ││   │ 77.5 C  │   │  │
│ │ │  │          │→ 75     │→ 70     │→ 15     │       ││   └─────────┘   │  │
│ │ └──┴──────────┴─────────┴─────────┴─────────┴───────┘│                   │  │
│ └───────────────────────────────────────────────────────┴───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Komponen UI:**
- Filter dropdown (Kategori → Periode → Kelas)
- Tabel input nilai dengan header item
- Kolom hasil kategori dengan grade badge
- Preview konversi di bawah input
- Modal inline item creation

### NEW: Template Presets (Modal Kategori Baru)

**Tujuan:** Kategori baru dengan setup otomatis dari template siap pakai.

**Template Tersedia:**
| Template | Items | Periods |
|----------|-------|---------|
| Jasmani Standar | Push Up (×2.5), Sit Up (×2), Pull Up (×5), Lari 2.4km | Triwulan 1-4 (25%) |
| PBB Mingguan | Seragam, Atensi, Sikap Baris, Pengetahuan, Presensi | Minggu 1-4, 5-8, 9-12, 13-16 |
| Kerajinan Tangan | Kualitas Produk, Ketepatan Waktu, Kebersihan | Bulan 1-3 (33%, 33%, 34%) |

**Alur dengan Template:**
```
1. Klik "Kategori Baru"
2. Pilih template (opsional)
3. Nama & warna auto-filled
4. Klik "Buat"
5. Items & Periods otomatis terbuat
```

### Halaman: Detail Kategori (/penilaian/[id])

**Fitur:**
- Header dengan avatar kategori dan gradient
- Kelola Item (CRUD dengan input type & conversion)
- Kelola Periode (CRUD dengan bobot)
- Progress bobot periode
- Warning jika total bobot ≠ 100%

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ ← [Avatar] Jasmani Taruna [Aktif]                   │
├─────────────────────────────────────────────────────┤
│ ⚠️ Total Bobot: 75% → Progress Bar                 │
├─────────────────────────────────────────────────────┤
│ ┌─ Item Penilaian ──────┐ ┌─ Periode ────────────┐│
│ │ [Icon] Item Penilaian │ │ [Icon] Periode       ││
│ │ [+ Tambah]           │ │ [+ Tambah]           ││
│ │ ┌─────────────────┐  │ │ ┌─────────────────┐ ││
│ │ │ Item Card      │  │ │ │ 1. Jan 25% [🎯]│ ││
│ │ │ (hover: edit/del)│  │ │ │ 2. Apr 25%    │ ││
│ │ └─────────────────┘  │ │ └─────────────────┘ ││
│ └──────────────────────┘ └───────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Halaman: Formula (/penilaian/formula)

**Fitur:**
- CRUD Formula
- Tambah komponen (Nilai Kategori atau Konversi Modul)
- Weight validation (harus 100%)
- Preview formula
- Grade reference

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ ← Formula & Nilai Rapor        [+ Formula Baru]    │
├─────────────────────────────────────────────────────┤
│ ┌─ Info Card ───────────────────────────────────┐  │
│ │ ℹ️ Tentang Formula...                          │  │
│ └──────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│ ┌─ Formula Card ────────────────────────────────┐  │
│ │ [📐] Semester Ganjil       [Aktif]  [✏️][🗑️]│  │
│ │ ┌────────────────────────────────────────┐  │  │
│ │ │ 🏷️ Jasmani Taruna              50%    │  │  │
│ │ │ 🏷️ PBB                      30%    │  │  │
│ │ │ 📐 Kehadiran (Konversi)      20%    │  │  │
│ │ └────────────────────────────────────────┘  │  │
│ │ Total: 100% ✅ ████████████ 100%           │  │
│ └──────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│ ┌─ Referensi Grade ─────────────────────────────┐  │
│ │ [A 90-100] [B 80-89] [C 70-79]...         │  │
│ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Part 8 — File Structure

```
app/
├── penilaian/
│   ├── page.tsx              ← Assessment Center (Daftar Kategori)
│   ├── quick/
│   │   └── page.tsx        ← Quick Score (Input Nilai Cepat + Filter Kelas + Tabel)
│   ├── [id]/
│   │   └── page.tsx         ← Detail Kategori (Items + Periode)
│   └── formula/
│       └── page.tsx          ← Kelola Formula

hooks/
├── useAssessment.ts          ← Legacy hook (v3.x)
└── useAssessmentNew.ts       ← New hook (v4.0)

types/
└── assessment.ts             ← Types v4.0

database/migrations/
└── 005_create_new_assessment_system.sql
```

---

## Part 9 — Conversion Functions

```typescript
// Konversi input ke nilai
function convertInput(
  input: string,
  inputType: InputType,
  conversionType: ConversionType,
  conversionValue?: string
): number

// Contoh penggunaan:
convertInput("35", "count", "multiply", "2.5")  // → 87.5
convertInput("12:30", "time", "lookup_table", 
  '{"10:00":100,"11:00":90,"12:00":80}')  // → 80

// Konversi attendance ke nilai
convertAttendanceToScore(95, rule)  // → 95 (lookup table)

// Kalkulasi Nilai Kategori
calculateCategoryScoreValue(categoryId, periodScoresMap)
```

---

## Part 10 — Business Rules

1. Kategori → Items (1:N)
2. Kategori → Periods (1:N)
3. Total bobot periode harus = 100%
4. Items bisa punya input_type dan conversion_type berbeda
5. Formula components total harus = 100%
6. Nilai Rapor = penjumlahan semua formula
7. Konversi modul (misal Presensi) dilakukan di modul Penilaian

---

**Last Updated:** 2026-07-08
**Version:** 7.0 - Quick Score v2 (Table input, Filter Kelas, Hasil kategori column, Hapus halaman input lama)

---
# End of Assessment Module (v4.0)
