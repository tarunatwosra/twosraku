# Student Registry Module (Buku Induk) — Compact
Version: 2.3 | Updated: 2026-07-10

**Purpose:** Student Registry adalah modul data master Twosraku — single source of truth untuk identitas siswa. Menyimpan & mengelola semua informasi siswa yang dibutuhkan seluruh sistem; setiap modul operasional bergantung pada data ini.

**Scope**
- Mengelola: Identitas Siswa, Informasi Akademik, Informasi Pribadi, Data Fisik & Kesehatan, Informasi Orang Tua/Wali, Kontak, Status Aktif, Riwayat.
- Tidak dikelola di sini: Absensi, Penilaian, Poin Karakter, dan modul operasional lain (masing-masing di modulnya sendiri).

**Tujuan Utama:** satu database siswa terpusat · mencegah duplikat identitas · menjaga rekam historis · mendukung pelaporan · mendukung integrasi dengan semua modul.

**Status Siswa:** sistem `is_active` (boolean). `true` = Aktif (masih bersekolah), `false` = Tidak Aktif (lulus/pindah/arsip).
**Lifecycle:** Aktif → Tidak Aktif → (opsional: Restore) → Aktif. Siswa aktif tampil di daftar utama; siswa tidak aktif tampil di halaman khusus; data historis tetap tersimpan.

**Navigasi:** Main Navigation → Student Registry (Buku Induk). Sub Pages: Student List, Student Detail, Create Student, Edit Student, Student History, Import Students, Export Students, Inactive Students.

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

**1. Daftar Siswa (`/buku-induk`)** — pencarian realtime (nama, NIS); filter: jenis kelamin, status aktif, jurusan, tingkat, kelas; sorting: nama, NIS, tanggal daftar; pagination; pilih massal + arsipkan; quick view modal; export data; konfigurasi kolom.

**2. Detail Siswa (`/buku-induk/[id]`)**
- Tab: Overview, Data Pribadi & Akademik, Data Orang Tua & Wali, Dokumen, Absensi (ringkasan), Penilaian (ringkasan), Karakter (ringkasan), Aktivitas (timeline).
- Aksi: Edit data, Cetak kartu siswa, Download data, Lihat riwayat, Arsipkan (toggle aktif/nonaktif).

**3. Tambah Siswa (`/buku-induk/new`)** — form multi-section (5 section di atas); validasi real-time; pengecekan NIS duplikat; auto-assign ke kelas jika dipilih; redirect ke detail setelah berhasil.

**4. Edit Siswa (`/buku-induk/[id]/edit`)** — pre-filled form; update semua field termasuk status aktif; validasi & duplicate check; struktur form sama dengan Tambah Siswa (5 section).

**5. Riwayat Siswa (`/buku-induk/[id]/history`)** — timeline aktivitas lengkap; kartu ringkasan; riwayat kelas; info audit.

**6. Siswa Tidak Aktif (`/buku-induk/archived`)** — daftar siswa tidak aktif; pencarian; pilih massal; restore (aktifkan kembali); hapus permanen (dengan konfirmasi).

**7. Import Siswa (`/buku-induk/import`)**
- Multi-step wizard dengan step indicator visual
- Upload file Excel/CSV dengan drag-and-drop
- Step: Upload → Strategi → Pemetaan → Validasi → Preview → Import → Selesai
- Download template dengan 25+ kolom

---

## Import Siswa

### Overview
Fitur import siswa memungkinkan import data dari file Excel/CSV dengan fitur validasi, preview, dan berbagai strategi import.

### Import Strategy Options
| Strategy | Label | Deskripsi |
|----------|-------|-----------|
| Insert | Tambah Baru | Hanya menambahkan siswa baru. NIS duplikat akan dilewati. |
| Upsert | Tambah/Update | Menambahkan siswa baru atau mengupdate yang sudah ada. |
| Update | Update Saja | Hanya mengupdate siswa yang sudah ada. Siswa baru akan dilewati. |
| Skip | Lewati Duplikat | Mengabaikan semua NIS yang sudah ada di database. |

### Field Mapping
Mendukung mapping otomatis dan manual untuk kolom-kolom berikut:
- **Data Diri:** NIS, Nama Lengkap, Nama Panggilan, Jenis Kelamin, Tempat Lahir, Tanggal Lahir, Agama, Kewarganegaraan, Golongan Darah
- **Kontak:** Alamat, No. Telepon, Email, NIK, NISN
- **Akademik:** Tahun Masuk
- **Data Orang Tua:** Nama Ayah, No. HP Ayah, Nama Ibu, No. HP Ibu, Nama Wali, No. HP Wali, Hubungan Wali
- **Kesehatan:** Tinggi Badan, Berat Badan, Penglihatan, Pendengaran, Kondisi Gigi, Cacat Tubuh, Riwayat Sakit, Alergi, Catatan Kesehatan

### Dry Run Mode
Validasi data tanpa mengubah database. Menampilkan:
- Total baris valid/invalid
- Estimasi insert/update/skip berdasarkan strategi
- Daftar warning dan error
- Estimasi waktu eksekusi

### Conflict Resolution
Mendeteksi NIS yang sudah ada di database. Menampilkan:
- Daftar konflik dengan detail siswa yang sudah ada
- Status aktif/nonaktif siswa existing
- Row number di file import

### Template Columns
Template download mencakup 25+ kolom untuk import data lengkap.

---

## UI Design Patterns

**1. Daftar Siswa (Student List)**
- Layout: full-width table dengan rounded container; sticky header saat scroll; minimal border, pakai spacing untuk pemisahan visual.
- Table Styling: Container = card padding 24px, radius 28px, soft shadow · Header = font medium(500), border-bottom ultra-tipis (#F1F5F9) · Row Height = 56px · Hover = background subtle (#F8FAFC) + translateY(-1px) subtle lift · Selected = background primary-soft (#EEF2FF) · Border = border-less, divider lines sangat halus.
- Filter Bar: soft card background #F8FAFC, rounded 18px, filter horizontal gap 12px, reset filters button di akhir.
- Actions: three-dot menu untuk row actions, slide-out dropdown dari kanan, dividers antar action groups.

**2. Detail Siswa (Student Detail)**
- Header Card: elevated card dengan subtle gradient overlay; avatar besar (96px) rounded 18px; info vertikal spacing generous; status badge di samping nama; quick actions di pojok kanan atas.
- Tab System: pill/segmented control style; Active = background primary (#2563EB), text white; Inactive = background transparent, text muted; padding 12px horizontal / 8px vertical; gap 8px antar tab; indikator garis bawah dihapus.
- Info Sections: card-based layout elevated (white background); section headers font semibold; info items 2-column grid; labels text-xs text-muted; values text-sm font-medium text-primary.
- Timeline: vertical layout dengan dot indicators; dot size 32px dengan icon centered; connector garis tipis (2px) color muted; content = title(medium), description(muted), timestamp(right-aligned); variants: success, info, warning, danger, neutral (warna berbeda).

**3. Form (Add/Edit)**
- Section Dividers: spacing-based (my-6); subtle background block dengan text centered; uppercase text letter-spacing; garis horizontal kiri-kanan.
- Form Fields: soft grouped sections card-like; background surface-secondary (#F8FAFC); padding 24px; gap antar fields 16px; full-width fields span 2 kolom.
- Focus States: border-focus (#4F51FF); shadow [0_0_0_3px_rgba(79,124,255,0.1)]; transition 200ms ease-out.
- Error States: border danger (#EF4444); background danger-soft (#FEF2F2); icon AlertCircle di kiri; message text-danger text-sm.

**4. Quick View Modal** — slide-in dari kanan; width 480px; radius 32px; backdrop semi-transparent + blur; header = avatar + nama + status; sections collapsible smooth animation; actions fixed di bottom.

**5. Empty States** — centered vertically; ilustrasi/icon besar (48-64px); title text-lg font-semibold; description text-sm text-muted; primary action button; secondary action (optional).

**6. Loading States** — skeleton rows animate-pulse; skeleton cards rounded corners; skeleton circles untuk avatar; background surface-hover; match layout dengan komponen yang di-load.

---

## Aturan Bisnis
NIS harus unik (tidak boleh duplikat) · NISN harus unik jika diisi · NIK harus unik jika diisi · siswa tidak bisa di dua kelas aktif sekaligus · siswa tidak aktif tetap menyimpan data historis · siswa tidak aktif tidak bisa menerima absensi baru.

## Validasi
- **Required:** NIS, Nama Lengkap, Jenis Kelamin, Tanggal Lahir, Status.
- **Format:** NISN = 10 digit angka; No. HP = format Indonesia (+62/08xx).

## Integrasi
- **Dashboard:** total siswa aktif, distribusi gender, siswa per kelas/jurusan — perhitungan terjadi di database, bukan di komponen.
- **Modul Lain:** Absensi (bergantung pada siswa aktif) · Penilaian (bergantung pada NIS siswa) · Karakter (bergantung pada NIS siswa) · Tabungan (satu-satu dengan siswa).

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

**Index:** `students`: student_number, is_active, full_name, nisn · `parents`: student_id

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

## Error Handling
NIS duplikat → "NIS sudah terdaftar" · NISN duplikat → "NISN sudah terdaftar" · field required kosong → inline error di bawah field · import gagal → laporan error detail · koneksi gagal → banner error dengan retry.

## Loading States
Skeleton table saat load daftar; skeleton detail saat load detail; spinner pada tombol aksi; progress indicator pada import.

## Empty States
| Kondisi | Pesan | Aksi |
|---------|--------|------|
| Belum ada siswa | "Belum ada data siswa" | Tambah Siswa |
| Tidak ada hasil search | "Tidak ada siswa yang cocok" | Reset filter |
| Tidak ada siswa tidak aktif | "Tidak ada siswa tidak aktif" | Kembali ke daftar |

---

## Catatan Migration v2.0
**Perubahan dari v1.0:** field `status` (varchar) dihapus → digantikan `is_active` (boolean); nilai status (prospective/active/transferred/graduated/archived) disederhanakan jadi Aktif/Tidak Aktif; ditambahkan field kesehatan baru (vision, hearing, teeth_condition, physical_disability, illness_history, allergies, health_notes); ditambahkan nisn; ditambahkan guardian_relation di tabel parents.
**SQL Migration:** jalankan file `database/migrations/001_update_students_table.sql`

## Definisi Selesai
Selesai jika: menyimpan semua data master siswa; mendukung lifecycle aktif/tidak aktif; berintegrasi dengan setiap modul operasional; menjaga integritas historis; mendukung import & export; performa responsif; mengikuti Design System; menjaga konsistensi data.

## Prinsip Akhir
Student Registry adalah fondasi Twosraku. Setiap modul operasional bergantung pada akurasi dan konsistensi data yang dikelola di sini. Melindungi integritas data siswa lebih penting daripada menambahkan fitur baru.

---
Last Updated: 2026-07-10 | Version: 2.3
# End of Student Registry Module (Compact)
