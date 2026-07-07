# Student Registry Module (Buku Induk)
Version: 2.0
Updated: 2026-07-03

---

## Purpose

Student Registry adalah modul data master dari Twosraku.

Modul ini menyimpan dan mengelola semua informasi siswa yang dibutuhkan oleh seluruh sistem.

Setiap modul operasional bergantung pada data ini.

Student Registry adalah single source of truth untuk identitas siswa.

---

## Scope

Student Registry mengelola:

- Identitas Siswa
- Informasi Akademik
- Informasi Pribadi
- Data Fisik & Kesehatan
- Informasi Orang Tua/Wali
- Kontak
- Status Aktif
- Riwayat

Modul ini hanya bertanggung jawab untuk menjaga data siswa.

Absensi, Penilaian, Poin Karakter, dan modul operasional lainnya dikelola di modul masing-masing.

---

## Tujuan Utama

1. Menyediakan satu database siswa terpusat
2. Mencegah duplikat identitas
3. Menjaga rekam historis
4. Mendukung pelaporan
5. Mendukung integrasi dengan semua modul

---

## Status Siswa

### Sistem Sederhana: `is_active` (Boolean)

| Nilai | Label | Deskripsi |
|-------|-------|-----------|
| `true` | Aktif | Siswa masih aktif bersekolah |
| `false` | Tidak Aktif | Siswa tidak aktif (lulus/pindah/arsip) |

### Lifecycle Siswa

```
Aktif → Tidak Aktif → (Opsional: Restore) → Aktif
```

- Siswa aktif tampil di daftar utama
- Siswa tidak aktif tampil di halaman khusus
- Data historis tetap tersimpan

---

## Navigasi

```
Main Navigation
    └── Student Registry (Buku Induk)

Sub Pages:
    ├── Student List (Daftar Siswa)
    ├── Student Detail (Detail Siswa)
    ├── Create Student (Tambah Siswa)
    ├── Edit Student (Edit Siswa)
    ├── Student History (Riwayat Siswa)
    ├── Import Students (Import Siswa)
    ├── Export Students (Export Siswa)
    └── Inactive Students (Siswa Tidak Aktif)
```

---

## Field Form Tambah/Edit Siswa

### 1. Data Diri

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| NIS | Text | ✅ | Nomor Induk Siswa |
| NISN | Text | - | Nomor Induk Sekolah Nasional (10 digit) |
| Nama Lengkap | Text | ✅ | Sesuai akta |
| Nama Panggilan | Text | - | Nama panggilan |
| Jenis Kelamin | Select | ✅ | Laki-laki / Perempuan |
| Golongan Darah | Select | - | A / B / AB / O / Tidak Tahu |
| Tempat Lahir | Text | - | |
| Tanggal Lahir | Date | ✅ | |
| Agama | Select | - | Islam / Kristen / Katolik / Hindu / Buddha / Konghucu / Kepercayaan Lainnya |
| No. WhatsApp | Text | - | Nomor HP aktif |
| Alamat | Textarea | - | Alamat lengkap |

### 2. Data Akademik

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Tahun Ajaran | Auto | - | Otomatis dari sistem |
| Angkatan | Number | - | Contoh: 2024, 2026 |
| Kelas | Select | - | Pilihan kelas berdasarkan tahun ajaran |
| Status | Select | ✅ | Aktif / Tidak Aktif |

**Catatan:** Data Kelas diambil dari **Settings Academic → Tab Kelas**. Pastikan kelas sudah dibuat di Settings sebelum menambahkan siswa.

### 3. Data Orang Tua/Wali

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Nama Ayah | Text | - | |
| No. HP Ayah | Text | - | |
| Nama Ibu | Text | - | |
| No. HP Ibu | Text | - | |
| Nama Wali | Text | - | Jika berbeda dari orang tua |
| Hubungan dengan Wali | Select | - | Kakek / Nenek / Paman / Tante / Kakak / Pengurus Panti / Lainnya |
| No. HP Wali | Text | - | |

### 4. Fisik dan Kesehatan

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Tinggi Badan | Number | - | Dalam cm |
| Berat Badan | Number | - | Dalam kg |
| Penglihatan | Select | - | Normal / Tidak Normal |
| Pendengaran | Select | - | Normal / Tidak Normal |
| Gigi dan Mulut | Select | - | Normal / Tidak Normal |
| Cacat Tubuh | Select | - | Tidak Ada / Ada |
| Riwayat Sakit | Textarea | - | |
| Alergi | Textarea | - | |
| Catatan Kesehatan | Textarea | - | |

### 5. Lainnya

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Status Siswa | Select | ✅ | Aktif / Tidak Aktif |
| Catatan Lainnya | Textarea | - | |

---

## Halaman-halaman

### 1. Daftar Siswa (`/buku-induk`)

**Fungsi:**
- Pencarian realtime (nama, NIS)
- Filter: Jenis kelamin, Status aktif, Jurusan, Tingkat, Kelas
- Sorting: Nama, NIS, Tanggal daftar
- Pagination dengan pilihan jumlah per halaman
- Pilih massal + Arsipkan
- Quick view modal
- Export data
- Konfigurasi kolom

### 2. Detail Siswa (`/buku-induk/[id]`)

**Tab:**
- Overview (ringkasan)
- Informasi Pribadi
- Data Akademik
- Data Orang Tua
- Wali
- Dokumen
- Absensi (ringkasan)
- Penilaian (ringkasan)
- Karakter (ringkasan)
- Aktivitas (timeline)

**Aksi:**
- Edit data
- Cetak kartu siswa
- Download data
- Lihat riwayat
- Arsipkan (toggle aktif/nonaktif)

### 3. Tambah Siswa (`/buku-induk/new`)

- Form multi-section sesuai struktur di atas
- Validasi real-time
- Pengecekan NIS duplikat
- Auto-assign ke kelas jika dipilih
- Redirect ke detail setelah berhasil

### 4. Edit Siswa (`/buku-induk/[id]/edit`)

- Pre-filled form
- Update semua field termasuk status aktif
- Validasi dan duplicate check
- **Struktur form sama dengan Tambah Siswa** (5 section)

### 5. Riwayat Siswa (`/buku-induk/[id]/history`)

- Timeline aktivitas lengkap
- Kartu ringkasan
- Riwayat kelas
- Info audit

### 6. Siswa Tidak Aktif (`/buku-induk/archived`)

- Daftar siswa tidak aktif
- Pencarian
- Pilih massal
- Restore (aktifkan kembali)
- Hapus permanen (dengan konfirmasi)

---

## UI Design Patterns

### 1. Daftar Siswa (Student List)

**Layout:**
- Full-width table dengan rounded container
- Sticky header saat scroll
- Minimal border, menggunakan spacing untuk pemisahan visual

**Table Styling:**
```
- Container: Card dengan padding 24px, radius 28px, soft shadow
- Header: Font medium (500), border-bottom ultra-tipis (#F1F5F9)
- Row Height: 56px
- Hover: Background subtle (#F8FAFC) + translateY(-1px) subtle lift
- Selected: Background primary-soft (#EEF2FF)
- Border: Border-less, menggunakan divider lines yang sangat halus
```

**Filter Bar:**
```
- Soft card styling dengan background #F8FAFC
- Rounded corners (18px)
- Filters disusun horizontal dengan gap 12px
- Reset filters button di akhir
```

**Actions:**
```
- Three-dot menu untuk row actions
- Slide-out dropdown dari kanan
- Dividers antara action groups
```

### 2. Detail Siswa (Student Detail)

**Header Card:**
```
- Elevated card dengan subtle gradient overlay
- Avatar besar (96px) dengan rounded corners (18px)
- Info disusun vertikal dengan spacing generous
- Status badge di samping nama
- Quick actions di pojok kanan atas
```

**Tab System:**
```
- Pill/segmented control style
- Active: Background primary (#2563EB), text white
- Inactive: Background transparent, text muted
- Padding: 12px horizontal, 8px vertical
- Gap: 8px antar tab
- Indikator garis bawah dihapus
```

**Info Sections:**
```
- Card-based layout dengan soft background (#F8FAFC)
- Section headers dengan font semibold
- Info items menggunakan 2-column grid
- Labels: text-xs, text-muted
- Values: text-sm, font-medium, text-primary
```

**Timeline:**
```
- Vertical layout dengan dot indicators
- Dot size: 32px dengan icon centered
- Connector: Garis tipis (2px) dengan color muted
- Content: Title (medium), description (muted), timestamp (right-aligned)
- Variants: success, info, warning, danger, neutral dengan colors berbeda
```

### 3. Form (Add/Edit)

**Section Dividers:**
```
- Spacing-based dividers (my-6)
- Subtle background block dengan text centered
- Uppercase text dengan letter-spacing
- Garis horizontal di kiri dan kanan
```

**Form Fields:**
```
- Soft grouped sections dengan card-like appearance
- Background: surface-secondary (#F8FAFC)
- Padding: 24px
- Gap antar fields: 16px
- Full-width fields span 2 columns
```

**Focus States:**
```
- Border: border-focus (#4F51FF)
- Shadow: [0_0_0_3px_rgba(79,124,255,0.1)]
- Transition: 200ms ease-out
```

**Error States:**
```
- Border: danger (#EF4444)
- Background: danger-soft (#FEF2F2)
- Icon: AlertCircle di kiri
- Message: text-danger, text-sm
```

### 4. Quick View Modal

```
- Slide-in dari kanan
- Width: 480px
- Radius: 32px
- Backdrop: semi-transparent dengan blur
- Header: Avatar + nama + status
- Sections: Collapsible dengan smooth animation
- Actions: Fixed di bottom
```

### 5. Empty States

```
- Centered vertically
- Ilustrasi/icon besar (48-64px)
- Title: text-lg, font-semibold
- Description: text-sm, text-muted
- Primary action button
- Secondary action (optional)
```

### 6. Loading States

```
- Skeleton rows dengan animate-pulse
- Skeleton cards dengan rounded corners
- Skeleton circles untuk avatar
- Background: surface-hover
- Match layout dengan component yang di-load
```

---

## Aturan Bisnis

1. **NIS harus unik** - tidak boleh duplikat
2. **NISN harus unik** jika diisi
3. **NIK harus unik** jika diisi
4. Siswa tidak bisa di dua kelas aktif sekaligus
5. Siswa tidak aktif tetap menyimpan data historis
6. Siswa tidak aktif tidak bisa menerima absensi baru

---

## Validasi

### Required
- NIS
- Nama Lengkap
- Jenis Kelamin
- Tanggal Lahir
- Status

### Format
- NISN: 10 digit angka
- No. HP: Format Indonesia (+62/08xx)

---

## Integrasi

### Dashboard
- Total siswa aktif
- Distribusi gender
- Siswa per kelas/jurusan
- Perhitungan terjadi di database, bukan di komponen

### Modul Lain
- **Absensi**: Bergantung pada siswa aktif
- **Penilaian**: Bergantung pada NIS siswa
- **Karakter**: Bergantung pada NIS siswa
- **Tabungan**: Satu-satu dengan siswa

---

## Struktur Database

### Tabel `students`

| Field | Type | Constraints |
|-------|------|-------------|
| id | uuid | PK |
| student_number | varchar(20) | NOT NULL, UNIQUE |
| nisn | varchar(20) | UNIQUE |
| national_id | varchar(20) | UNIQUE |
| full_name | varchar(255) | NOT NULL |
| nickname | varchar(100) | |
| gender | varchar(10) | NOT NULL |
| birth_place | varchar(100) | |
| birth_date | date | |
| religion | varchar(50) | |
| nationality | varchar(50) | DEFAULT 'Indonesia' |
| blood_type | varchar(5) | |
| height_cm | decimal(5,2) | |
| weight_kg | decimal(5,2) | |
| vision | varchar(20) | DEFAULT 'normal' |
| hearing | varchar(20) | DEFAULT 'normal' |
| teeth_condition | varchar(20) | DEFAULT 'normal' |
| physical_disability | varchar(20) | DEFAULT 'none' |
| illness_history | text | |
| allergies | text | |
| health_notes | text | |
| address | text | |
| phone | varchar(20) | |
| email | varchar(255) | |
| photo_url | text | |
| is_active | boolean | DEFAULT true |
| enrollment_year | integer | |
| graduation_year | integer | |
| transfer_date | date | |
| transfer_reason | text | |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Tabel `parents`

| Field | Type | Constraints |
|-------|------|-------------|
| id | uuid | PK |
| student_id | uuid | FK → students.id |
| type | varchar(20) | father/mother/guardian |
| full_name | varchar(255) | NOT NULL |
| nik | varchar(20) | |
| occupation | varchar(100) | |
| education | varchar(50) | |
| phone | varchar(20) | |
| email | varchar(255) | |
| address | text | |
| is_primary | boolean | DEFAULT false |
| guardian_relation | varchar(50) | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Index Database

```
students: student_number, is_active, full_name, nisn
parents: student_id
```

---

## Permissions

| Role | Akses |
|------|-------|
| Administrator | Full Access |
| Vice Principal | Read, Create, Update |
| Teacher | Read Only |
| Homeroom Teacher | Read, Limited Update |
| Staff | Read, Import, Export |
| Guest | No Access |

---

## Error Handling

- NIS duplikat → "NIS sudah terdaftar"
- NISN duplikat → "NISN sudah terdaftar"
- Field required kosong → Inline error di bawah field
- Import gagal → Laporan error detail
- Koneksi gagal → Banner error dengan retry

---

## Loading States

- Skeleton table saat load daftar
- Skeleton detail saat load detail
- Spinner pada tombol aksi
- Progress indicator pada import

---

## Empty States

| Kondisi | Pesan | Aksi |
|---------|--------|------|
| Belum ada siswa | "Belum ada data siswa" | Tambah Siswa |
| Tidak ada hasil search | "Tidak ada siswa yang cocok" | Reset filter |
| Tidak ada siswa tidak aktif | "Tidak ada siswa tidak aktif" | Kembali ke daftar |

---

## Catatan Migration v2.0

### Perubahan dari v1.0
1. Field `status` (varchar) dihapus → digantikan `is_active` (boolean)
2. Nilai status (prospective/active/transferred/graduated/archived) disederhanakan jadi Aktif/Tidak Aktif
3. Ditambahkan field kesehatan baru: vision, hearing, teeth_condition, physical_disability, illness_history, allergies, health_notes
4. Ditambahkan nisn
5. Ditambahkan guardian_relation di tabel parents

### SQL Migration
Jalankan file: `database/migrations/001_update_students_table.sql`

---

## Definisi Selesai

Student Registry dianggap selesai jika:

1. Menyimpan semua data master siswa
2. Mendukung lifecycle aktif/tidak aktif
3. Berintegrasi dengan setiap modul operasional
4. Menjaga integritas historis
5. Mendukung import dan export
6. Memiliki performa responsif
7. Mengikuti Design System
8. Menjaga konsistensi data

---

## Prinsip Akhir

Student Registry adalah fondasi Twosraku.

Setiap modul operasional bergantung pada akurasi dan konsistensi data yang dikelola di sini.

Melindungi integritas data siswa lebih penting daripada menambahkan fitur baru.

---

**Last Updated**: 2026-07-06
**Version**: 2.1
