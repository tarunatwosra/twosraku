# Database Schema - Twosraku

**Versi**: 1.0  
**Last Updated**: 2026-07-01  
**Database**: Supabase (PostgreSQL)

---

## 📋 Pendahuluan

Dokumen ini adalah **sumber kebenaran** untuk struktur database Twosraku. Setiap tabel harus dibuat di Supabase berdasarkan definisi di bawah ini.

### Urutan Pembuatan Tabel

```
Tahap 1: Core/Master Tables (Wajib dibuat pertama)
Tahap 2: Academic Tables (Bergantung pada Core)
Tahap 3: Operational Tables (Bergantung pada Academic)
Tahap 4: System Tables (Bisa dibuat kapan saja)
```

---

## 🎓 TAHAP 1: CORE / MASTER TABLES

### 1.1 academic_years (Tahun Ajaran)

**Deskripsi**: Menyimpan data tahun ajaran

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK, default uuid_generate_v4() | Primary key |
| name | varchar(20) | NOT NULL | Nama tahun ajaran (contoh: "2024/2025") |
| start_date | date | NOT NULL | Tanggal mulai tahun ajaran |
| end_date | date | NOT NULL | Tanggal selesai tahun ajaran |
| is_active | boolean | DEFAULT false | Apakah tahun ajaran ini aktif |
| is_locked | boolean | DEFAULT false | Apakah tahun ajaran terkunci (tidak bisa diedit) |
| created_at | timestamptz | DEFAULT now() | Timestamp pembuatan |
| updated_at | timestamptz | DEFAULT now() | Timestamp update |
| created_by | uuid | FK → users.id | User yang membuat |
| updated_by | uuid | FK → users.id | User yang update |

**Index**: `idx_academic_years_is_active`

---

### 1.2 semesters (Semester)

**Deskripsi**: Menyimpan data semester dalam tahun ajaran

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| academic_year_id | uuid | FK → academic_years.id, NOT NULL | Tahun ajaran |
| name | varchar(20) | NOT NULL | Nama semester (contoh: "Ganjil", "Genap") |
| semester_number | integer | NOT NULL, CHECK(1-2) | Nomor semester (1 atau 2) |
| start_date | date | NOT NULL | Tanggal mulai |
| end_date | date | NOT NULL | Tanggal selesai |
| is_active | boolean | DEFAULT false | Apakah semester aktif |
| is_locked | boolean | DEFAULT false | Apakah terkunci |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_semesters_academic_year`, `idx_semesters_is_active`

---

### 1.3 majors (Jurusan)

**Deskripsi**: Menyimpan data jurusan/major

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(100) | NOT NULL | Nama jurusan |
| code | varchar(10) | NOT NULL, UNIQUE | Kode jurusan (contoh: "TKJ", "RPL") |
| description | text | | Deskripsi |
| status | varchar(20) | DEFAULT 'active' | Status: active, inactive |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

### 1.4 grades (Tingkat/Kelas)

**Deskripsi**: Menyimpan tingkatan kelas (contoh: X, XI, XII)

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(20) | NOT NULL | Nama tingkat (contoh: "X", "XI", "XII") |
| level | integer | NOT NULL, UNIQUE | Level angka (contoh: 10, 11, 12) |
| description | text | | Deskripsi |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

### 1.5 classes (Kelas)

**Deskripsi**: Menyimpan data kelas

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(50) | NOT NULL | Nama kelas (contoh: "X TKJ 1") |
| grade_id | uuid | FK → grades.id, NOT NULL | Tingkat |
| major_id | uuid | FK → majors.id, NOT NULL | Jurusan |
| academic_year_id | uuid | FK → academic_years.id, NOT NULL | Tahun ajaran |
| room_number | varchar(10) | | Nomor ruang |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_classes_academic_year`, `idx_classes_grade_major`

---

### 1.6 students (Siswa)

**Deskripsi**: Tabel utama siswa - single source of truth untuk student identity

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_number | varchar(20) | NOT NULL, UNIQUE | Nomor induk siswa |
| national_id | varchar(20) | UNIQUE | NIK/KTP (nullable) |
| full_name | varchar(255) | NOT NULL | Nama lengkap |
| nickname | varchar(100) | | Nama panggilan |
| gender | varchar(10) | NOT NULL | male, female |
| birth_place | varchar(100) | | Tempat lahir |
| birth_date | date | | Tanggal lahir |
| religion | varchar(50) | | Agama |
| nationality | varchar(50) | DEFAULT 'Indonesia' | Kewarganegaraan |
| blood_type | varchar(5) | | Golongan darah |
| height_cm | decimal(5,2) | | Tinggi badan (cm) |
| weight_kg | decimal(5,2) | | Berat badan (kg) |
| address | text | | Alamat lengkap |
| phone | varchar(20) | | Nomor HP |
| email | varchar(255) | | Email |
| photo_url | text | | URL foto |
| status | varchar(20) | DEFAULT 'prospective' | prospective, active, transferred, graduated, archived |
| enrollment_year | integer | | Tahun masuk |
| graduation_year | integer | | Tahun lulus |
| transfer_date | date | | Tanggal mutasi |
| transfer_reason | text | | Alasan mutasi |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Index**: `idx_students_number`, `idx_students_status`, `idx_students_name`

---

### 1.7 student_classes (Relasi Siswa-Kelas)

**Deskripsi**: Many-to-many antara siswa dan kelas

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| class_id | uuid | FK → classes.id, NOT NULL | Kelas |
| academic_year_id | uuid | FK → academic_years.id, NOT NULL | Tahun ajaran |
| attendance_number | integer | | Nomor presensi di kelas |
| is_homeroom | boolean | DEFAULT false | Apakah wali kelas |
| status | varchar(20) | DEFAULT 'active' | Status |
| start_date | date | | Tanggal masuk kelas |
| end_date | date | | Tanggal keluar kelas |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_student_class_year` (student_id, class_id, academic_year_id)

---

### 1.8 parents (Orang Tua/Wali)

**Deskripsi**: Data orang tua/wali siswa

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| type | varchar(20) | NOT NULL | father, mother, guardian |
| full_name | varchar(255) | NOT NULL | Nama lengkap |
| nik | varchar(20) | | NIK |
| birth_date | date | | Tanggal lahir |
| occupation | varchar(100) | | Pekerjaan |
| education | varchar(50) | | Pendidikan terakhir |
| phone | varchar(20) | | Nomor HP |
| email | varchar(255) | | Email |
| address | text | | Alamat |
| is_primary | boolean | DEFAULT false | Apakah kontak utama |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_parents_student`

---

## 👥 TAHAP 2: USERS & AUTHENTICATION

### 2.1 users (Pengguna)

**Deskripsi**: User aplikasi (guru, staff, admin)

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| email | varchar(255) | NOT NULL, UNIQUE | Email |
| password_hash | varchar(255) | | Hash password (nullable untuk SSO) |
| full_name | varchar(255) | NOT NULL | Nama lengkap |
| nickname | varchar(100) | | Nama panggilan |
| gender | varchar(10) | | male, female |
| birth_date | date | | Tanggal lahir |
| phone | varchar(20) | | Nomor HP |
| photo_url | text | | URL foto |
| employee_number | varchar(20) | UNIQUE | Nomor pegawai |
| role | varchar(50) | NOT NULL | role_id reference (akan dibuat di bawah) |
| status | varchar(20) | DEFAULT 'active' | active, inactive, locked |
| last_login | timestamptz | | Login terakhir |
| password_changed_at | timestamptz | | Password terakhir diubah |
| password_expires_at | timestamptz | | Password expiry |
| login_attempts | integer | DEFAULT 0 | Jumlah percobaan login gagal |
| locked_until | timestamptz | | Akun terkunci sampai |
| two_factor_enabled | boolean | DEFAULT false | 2FA enabled |
| two_factor_secret | varchar(255) | | Secret 2FA |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Index**: `idx_users_email`, `idx_users_status`, `idx_users_role`

---

### 2.2 roles (Peran)

**Deskripsi**: Definisi peran sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(50) | NOT NULL, UNIQUE | Nama peran |
| display_name | varchar(100) | NOT NULL | Nama tampilan |
| description | text | | Deskripsi |
| is_system | boolean | DEFAULT false | Apakah role system (tidak bisa dihapus) |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Default Roles**: administrator, principal, vice_principal, teacher, homeroom_teacher, counselor, staff, guest

---

### 2.3 permissions (Izin)

**Deskripsi**: Definisi izin sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| module | varchar(50) | NOT NULL | Nama modul |
| action | varchar(50) | NOT NULL | Nama aksi (create, read, update, delete, dll) |
| display_name | varchar(100) | NOT NULL | Nama tampilan |
| description | text | | Deskripsi |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_module_action` (module, action)

---

### 2.4 role_permissions (Relasi Peran-Izin)

**Deskripsi**: Many-to-many antara peran dan izin

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| role_id | uuid | FK → roles.id, NOT NULL | Peran |
| permission_id | uuid | FK → permissions.id, NOT NULL | Izin |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_role_permission` (role_id, permission_id)

---

### 2.5 user_sessions (Sesi User)

**Deskripsi**: Track active sessions

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| session_id | varchar(255) | NOT NULL, UNIQUE | Session identifier |
| user_id | uuid | FK → users.id, NOT NULL | User |
| device | varchar(100) | | Device info |
| browser | varchar(100) | | Browser info |
| os | varchar(100) | | OS info |
| ip_address | varchar(50) | | IP address |
| location | varchar(255) | | Lokasi |
| login_at | timestamptz | DEFAULT now() | Waktu login |
| last_activity | timestamptz | DEFAULT now() | Aktivitas terakhir |
| expires_at | timestamptz | | Session expiry |
| is_current | boolean | DEFAULT false | Apakah sesi saat ini |
| revoked | boolean | DEFAULT false | Apakah dicabut |
| revoked_at | timestamptz | | Waktu pencabutan |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_sessions_user`, `idx_sessions_expires`

---

### 2.6 login_history (Riwayat Login)

**Deskripsi**: Audit login

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| user_id | uuid | FK → users.id, NOT NULL | User |
| email | varchar(255) | NOT NULL | Email yang digunakan |
| ip_address | varchar(50) | | IP |
| device | varchar(100) | | Device |
| browser | varchar(100) | | Browser |
| os | varchar(100) | | OS |
| status | varchar(20) | NOT NULL | success, failed, locked |
| failure_reason | varchar(255) | | Alasan gagal |
| login_at | timestamptz | DEFAULT now() | Waktu login |

**Index**: `idx_login_history_user`, `idx_login_history_date`

---

## 📊 TAHAP 3: OPERATIONAL MODULES

---

### 3.1 ATTENDANCE (PRESENSI)

#### 3.1.1 attendances (Presensi)

**Deskripsi**: Record kehadiran siswa per hari

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| class_id | uuid | FK → classes.id, NOT NULL | Kelas |
| academic_year_id | uuid | FK → academic_years.id, NOT NULL | Tahun ajaran |
| semester_id | uuid | FK → semesters.id, NOT NULL | Semester |
| date | date | NOT NULL | Tanggal presensi |
| status | varchar(20) | NOT NULL | present, late, permission, sick, absent |
| notes | varchar(255) | | Catatan |
| recorded_by | uuid | FK → users.id | User yang input |
| recorded_at | timestamptz | DEFAULT now() | Waktu input |
| is_verified | boolean | DEFAULT false | Apakah diverifikasi |
| verified_by | uuid | FK → users.id | User verifier |
| verified_at | timestamptz | | Waktu verifikasi |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_student_date` (student_id, date)

**Index**: `idx_attendances_date`, `idx_attendances_student`, `idx_attendances_class`

---

### 3.2 ASSESSMENT (PENILAIAN)

#### 3.2.1 assessment_categories (Kategori Penilaian)

**Deskripsi**: Kategori penilaian (Akademik, Karakter, dll)

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(100) | NOT NULL, UNIQUE | Nama kategori |
| description | text | | Deskripsi |
| icon | varchar(50) | | Nama ikon |
| color | varchar(20) | | Warna hex |
| display_order | integer | DEFAULT 0 | Urutan tampil |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Examples**: Academic, Character, Leadership, Discipline, Physical, Practical

---

#### 3.2.2 assessment_templates (Template Penilaian)

**Deskripsi**: Blueprint reusable untuk assessment

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| category_id | uuid | FK → assessment_categories.id, NOT NULL | Kategori |
| name | varchar(255) | NOT NULL | Nama template |
| description | text | | Deskripsi |
| scoring_method | varchar(50) | DEFAULT 'weighted_average' | weighted_average, simple_average, highest, lowest |
| max_score | decimal(5,2) | DEFAULT 100 | Skor maksimum |
| min_score | decimal(5,2) | DEFAULT 0 | Skor minimum |
| passing_score | decimal(5,2) | DEFAULT 0 | Skor kelulusan |
| allow_decimal | boolean | DEFAULT true | Izinkan desimal |
| auto_calculate | boolean | DEFAULT true | Auto kalkulasi |
| display_order | integer | DEFAULT 0 | Urutan |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Examples**: Mid Semester Exam, Weekly Discipline Inspection, Morning Parade Evaluation

---

#### 3.2.3 assessment_items (Item Penilaian)

**Deskripsi**: Komponen terkecil yang diukur dalam assessment

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| template_id | uuid | FK → assessment_templates.id, NOT NULL | Template |
| name | varchar(255) | NOT NULL | Nama item |
| description | text | | Deskripsi |
| score_type | varchar(50) | DEFAULT 'numeric' | numeric, percentage, boolean, rating, letter_grade, custom |
| weight | decimal(5,2) | DEFAULT 0 | Bobot (persen) |
| min_score | decimal(5,2) | DEFAULT 0 | Skor minimum |
| max_score | decimal(5,2) | DEFAULT 100 | Skor maksimum |
| passing_score | decimal(5,2) | DEFAULT 0 | Skor kelulusan |
| display_order | integer | DEFAULT 0 | Urutan |
| is_required | boolean | DEFAULT true | Apakah wajib |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Examples**: Uniform, Discipline, Voice Command, Push Up, Knowledge Test

---

#### 3.2.4 assessment_sessions (Sesi Penilaian)

**Deskripsi**: Satu eksekusi template

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| template_id | uuid | FK → assessment_templates.id, NOT NULL | Template |
| name | varchar(255) | NOT NULL | Nama sesi |
| description | text | | Deskripsi |
| academic_year_id | uuid | FK → academic_years.id, NOT NULL | Tahun ajaran |
| semester_id | uuid | FK → semesters.id, NOT NULL | Semester |
| class_id | uuid | FK → classes.id | Kelas (nullable) |
| evaluator_id | uuid | FK → users.id | Penilai |
| start_date | date | | Tanggal mulai |
| end_date | date | | Tanggal selesai |
| status | varchar(20) | DEFAULT 'draft' | Status |
| is_locked | boolean | DEFAULT false | Apakah terkunci |
| locked_by | uuid | FK → users.id | User yang kunci |
| locked_at | timestamptz | | Waktu lock |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |
| created_by | uuid | FK → users.id | User pembuat |
| updated_by | uuid | FK → users.id | User pengupdate |

**Examples**: Week 1 Assessment, Semester 1 Exam

**Index**: `idx_sessions_template`, `idx_sessions_academic_year`, `idx_sessions_status`

---

#### 3.2.5 assessment_participants (Peserta Penilaian)

**Deskripsi**: Siswa yang berpartisipasi dalam sesi

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| session_id | uuid | FK → assessment_sessions.id, NOT NULL | Sesi |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| status | varchar(20) | DEFAULT 'assigned' | assigned, present, absent, completed, excluded, withdrawn |
| notes | text | | Catatan |
| assigned_at | timestamptz | DEFAULT now() | Waktu assignment |
| assigned_by | uuid | FK → users.id | User yang assign |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_session_student` (session_id, student_id)

---

#### 3.2.6 student_scores (Nilai Siswa)

**Deskripsi**: Nilai aktual siswa

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| participant_id | uuid | FK → assessment_participants.id, NOT NULL | Peserta |
| item_id | uuid | FK → assessment_items.id, NOT NULL | Item penilaian |
| raw_score | decimal(10,2) | | Skor mentah |
| final_score | decimal(10,2) | | Skor final (setelah kalkulasi) |
| grade | varchar(5) | | Grade (A, B, C, dll) |
| remark | text | | Komentar |
| status | varchar(20) | DEFAULT 'draft' | Status |
| evaluator_id | uuid | FK → users.id | Penilai |
| scored_at | timestamptz | DEFAULT now() | Waktu penilaian |
| reviewed_at | timestamptz | | Waktu review |
| reviewed_by | uuid | FK → users.id | User reviewer |
| approved_at | timestamptz | | Waktu approve |
| approved_by | uuid | FK → users.id | User approver |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_participant_item` (participant_id, item_id)

**Index**: `idx_scores_participant`, `idx_scores_item`

---

#### 3.2.7 score_history (Riwayat Perubahan Nilai)

**Deskripsi**: Audit perubahan nilai

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| score_id | uuid | FK → student_scores.id, NOT NULL | Nilai |
| previous_value | decimal(10,2) | | Nilai sebelumnya |
| new_value | decimal(10,2) | | Nilai baru |
| reason | text | | Alasan perubahan |
| changed_by | uuid | FK → users.id, NOT NULL | User yang ubah |
| changed_at | timestamptz | DEFAULT now() | Waktu perubahan |

---

#### 3.2.8 grade_conversions (Konversi Grade)

**Deskripsi**: Rule konversi skor ke grade

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| template_id | uuid | FK → assessment_templates.id, NOT NULL | Template |
| min_score | decimal(5,2) | NOT NULL | Skor minimum |
| max_score | decimal(5,2) | NOT NULL | Skor maksimum |
| grade | varchar(5) | NOT NULL | Grade |
| description | varchar(100) | | Deskripsi |
| color | varchar(20) | | Warna |
| is_passing | boolean | DEFAULT true | Apakah lulus |
| display_order | integer | DEFAULT 0 | Urutan |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

## 🏆 CHARACTER POINTS (POIN KARAKTER)

#### 3.3.1 character_categories (Kategori Karakter)

**Deskripsi**: Kategori perilaku karakter

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(100) | NOT NULL, UNIQUE | Nama kategori |
| description | text | | Deskripsi |
| color | varchar(20) | | Warna |
| icon | varchar(50) | | Ikon |
| display_order | integer | DEFAULT 0 | Urutan |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Examples**: Discipline, Responsibility, Leadership, Courtesy, Integrity, Teamwork

---

#### 3.3.2 behavior_types (Tipe Perilaku)

**Deskripsi**: Definisi perilaku yang bisa direkam

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| category_id | uuid | FK → character_categories.id, NOT NULL | Kategori |
| name | varchar(255) | NOT NULL | Nama perilaku |
| description | text | | Deskripsi |
| point_value | integer | NOT NULL | Nilai poin |
| is_positive | boolean | NOT NULL | TRUE = positif, FALSE = negatif |
| severity | varchar(20) | | info, minor, moderate, major, critical |
| requires_approval | boolean | DEFAULT false | Butuh persetujuan |
| requires_counseling | boolean | DEFAULT false | Butuh konseling |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Examples**:
- Positive: Helping Friends (+10), Excellent Leadership (+50), Winning Competition (+100)
- Negative: Late Arrival (-5), Incomplete Uniform (-10), Smoking (-100)

---

#### 3.3.3 character_events (Event Karakter)

**Deskripsi**: Event dimana perilaku dicatat

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(255) | NOT NULL | Nama event |
| description | text | | Deskripsi |
| event_date | date | NOT NULL | Tanggal event |
| location | varchar(255) | | Lokasi |
| organizer | varchar(255) | | Penanggung jawab |
| academic_year_id | uuid | FK → academic_years.id | Tahun ajaran |
| semester_id | uuid | FK → semesters.id | Semester |
| status | varchar(20) | DEFAULT 'scheduled' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Examples**: Morning Inspection, Flag Ceremony, School Competition

---

#### 3.3.4 character_records (Record Karakter)

**Deskripsi**: Record perilaku siswa

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| behavior_type_id | uuid | FK → behavior_types.id, NOT NULL | Tipe perilaku |
| event_id | uuid | FK → character_events.id | Event (nullable) |
| class_id | uuid | FK → classes.id | Kelas |
| academic_year_id | uuid | FK → academic_years.id | Tahun ajaran |
| semester_id | uuid | FK → semesters.id | Semester |
| date | date | NOT NULL | Tanggal |
| description | text | | Deskripsi |
| evidence_url | text | | URL bukti (foto, dll) |
| status | varchar(20) | DEFAULT 'draft' | Status |
| reporter_id | uuid | FK → users.id, NOT NULL | Pelapor |
| reviewed_by | uuid | FK → users.id | Reviewer |
| reviewed_at | timestamptz | | Waktu review |
| approved_by | uuid | FK → users.id | Approver |
| approved_at | timestamptz | | Waktu approve |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_character_records_student`, `idx_character_records_date`

---

#### 3.3.5 character_summary (Ringkasan Karakter)

**Deskripsi**: Summary poin karakter per siswa (denormalized untuk performance)

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL, UNIQUE | Siswa |
| academic_year_id | uuid | FK → academic_years.id | Tahun ajaran |
| positive_points | integer | DEFAULT 0 | Total poin positif |
| negative_points | integer | DEFAULT 0 | Total poin negatif |
| net_score | integer | DEFAULT 0 | Poin bersih |
| total_records | integer | DEFAULT 0 | Total record |
| positive_records | integer | DEFAULT 0 | Record positif |
| negative_records | integer | DEFAULT 0 | Record negatif |
| highest_achievement | varchar(255) | | Achievement tertinggi |
| most_frequent_violation | varchar(255) | | Violation tersering |
| last_updated | timestamptz | DEFAULT now() | Update terakhir |

**Index**: `idx_character_summary_student`

---

#### 3.3.6 counseling_recommendations (Rekomendasi Konseling)

**Deskripsi**: Rekomendasi konseling berdasarkan karakter

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| character_record_id | uuid | FK → character_records.id | Record terkait |
| recommendation_reason | text | NOT NULL | Alasan |
| recommended_by | uuid | FK → users.id, NOT NULL | User rekomendasi |
| recommended_at | timestamptz | DEFAULT now() | Waktu |
| status | varchar(20) | DEFAULT 'pending' | pending, scheduled, completed, cancelled |
| scheduled_date | date | | Tanggal dijadwalkan |
| counselor_id | uuid | FK → users.id | Konselor |
| completed_at | timestamptz | | Waktu selesai |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

## 🎖️ SPECIAL UNITS (PASUKAN KHUSUS)

#### 3.4.1 special_units (Unit Khusus)

**Deskripsi**: Definisi unit khusus

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(255) | NOT NULL | Nama unit |
| description | text | | Deskripsi |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.4.2 special_unit_positions (Posisi Unit Khusus)

**Deskripsi**: Posisi/jabatan dalam unit

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| unit_id | uuid | FK → special_units.id, NOT NULL | Unit |
| name | varchar(100) | NOT NULL | Nama posisi |
| description | text | | Deskripsi |
| responsibilities | text | | Tanggung jawab |
| display_order | integer | DEFAULT 0 | Urutan |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Examples**: Commander, Vice Commander, Secretary, Treasurer, Member

---

#### 3.4.3 special_unit_members (Anggota Unit Khusus)

**Deskripsi**: Anggota unit khusus

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| unit_id | uuid | FK → special_units.id, NOT NULL | Unit |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| position_id | uuid | FK → special_unit_positions.id | Posisi |
| status | varchar(20) | DEFAULT 'candidate' | Status |
| join_date | date | NOT NULL | Tanggal masuk |
| leave_date | date | | Tanggal keluar |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_unit_student_active` (unit_id, student_id) WHERE status = 'active'

---

#### 3.4.4 special_unit_assignments (Penugasan Unit)

**Deskripsi**: Tugas/assignment unit

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| unit_id | uuid | FK → special_units.id, NOT NULL | Unit |
| name | varchar(255) | NOT NULL | Nama tugas |
| description | text | | Deskripsi |
| assignment_date | date | NOT NULL | Tanggal |
| time | time | | Waktu |
| location | varchar(255) | | Lokasi |
| supervisor_id | uuid | FK → users.id | Supervisor |
| status | varchar(20) | DEFAULT 'scheduled' | Status |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.4.5 special_unit_assignment_members (Anggota Penugasan)

**Deskripsi**: Anggota yang ditugaskan

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| assignment_id | uuid | FK → special_unit_assignments.id, NOT NULL | Penugasan |
| member_id | uuid | FK → special_unit_members.id, NOT NULL | Anggota |
| attendance_status | varchar(20) | | present, absent, excuse |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.4.6 special_unit_training (Pelatihan Unit)

**Deskripsi**: Riwayat pelatihan

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| unit_id | uuid | FK → special_units.id, NOT NULL | Unit |
| name | varchar(255) | NOT NULL | Nama pelatihan |
| instructor | varchar(255) | | Instruktur |
| training_date | date | NOT NULL | Tanggal |
| location | varchar(255) | | Lokasi |
| duration_hours | decimal(5,2) | | Durasi (jam) |
| evaluation | text | | Evaluasi |
| certificate_url | text | | URL sertifikat |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.4.7 special_unit_achievements (Achievement Unit)

**Deskripsi**: Pencapaian anggota

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| member_id | uuid | FK → special_unit_members.id, NOT NULL | Anggota |
| title | varchar(255) | NOT NULL | Judul |
| category | varchar(50) | NOT NULL | Kategori |
| achievement_date | date | NOT NULL | Tanggal |
| organizer | varchar(255) | | Penyelenggara |
| description | text | | Deskripsi |
| certificate_url | text | | URL sertifikat |
| evidence_url | text | | URL bukti |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

## 🙏 SPIRITUAL

#### 3.5.1 spiritual_activities (Aktivitas Spiritual)

**Deskripsi**: Aktivitas spiritual

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| name | varchar(255) | NOT NULL | Nama aktivitas |
| category | varchar(50) | NOT NULL | Kategori |
| description | text | | Deskripsi |
| date | date | NOT NULL | Tanggal |
| time | time | | Waktu |
| location | varchar(255) | | Lokasi |
| supervisor_id | uuid | FK → users.id | Supervisor |
| academic_year_id | uuid | FK → academic_years.id | Tahun ajaran |
| semester_id | uuid | FK → semesters.id | Semester |
| status | varchar(20) | DEFAULT 'scheduled' | Status |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.5.2 spiritual_participation (Partisipasi Spiritual)

**Deskripsi**: Partisipasi siswa dalam aktivitas spiritual

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| activity_id | uuid | FK → spiritual_activities.id, NOT NULL | Aktivitas |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| attendance_status | varchar(20) | DEFAULT 'present' | present, absent, excuse, late, cancelled |
| participation_level | varchar(20) | | excellent, good, satisfactory, needs_improvement, observed |
| notes | text | | Catatan |
| recorded_by | uuid | FK → users.id | User pencatat |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_activity_student` (activity_id, student_id)

---

#### 3.5.3 spiritual_reflections (Refleksi Spiritual)

**Deskripsi**: Catatan refleksi

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| activity_id | uuid | FK → spiritual_activities.id | Aktivitas |
| reflection_date | date | NOT NULL | Tanggal |
| observation | text | NOT NULL | Observasi |
| recommendation | text | | Rekomendasi |
| recorded_by | uuid | FK → users.id, NOT NULL | User pencatat |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.5.4 spiritual_achievements (Achievement Spiritual)

**Deskripsi**: Pencapaian spiritual

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL | Siswa |
| title | varchar(255) | NOT NULL | Judul |
| category | varchar(50) | NOT NULL | Kategori |
| achievement_date | date | NOT NULL | Tanggal |
| description | text | | Deskripsi |
| certificate_url | text | | URL sertifikat |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

## 💰 SAVINGS (TABUNGAN)

#### 3.6.1 savings_accounts (Akun Tabungan)

**Deskripsi**: Akun tabungan siswa

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| student_id | uuid | FK → students.id, NOT NULL, UNIQUE | Siswa |
| account_number | varchar(50) | UNIQUE | Nomor akun |
| current_balance | decimal(15,2) | DEFAULT 0 | Saldo saat ini |
| status | varchar(20) | DEFAULT 'active' | Status |
| opened_date | date | NOT NULL | Tanggal buka |
| closed_date | date | | Tanggal tutup |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.6.2 savings_transactions (Transaksi Tabungan)

**Deskripsi**: Semua transaksi tabungan

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| account_id | uuid | FK → savings_accounts.id, NOT NULL | Akun |
| transaction_number | varchar(50) | NOT NULL, UNIQUE | Nomor transaksi |
| transaction_type | varchar(20) | NOT NULL | deposit, withdrawal, adjustment, opening_balance, correction |
| transaction_date | date | NOT NULL | Tanggal |
| amount | decimal(15,2) | NOT NULL | Jumlah |
| balance_before | decimal(15,2) | NOT NULL | Saldo sebelum |
| balance_after | decimal(15,2) | NOT NULL | Saldo sesudah |
| payment_method | varchar(50) | | Metode pembayaran |
| reference_number | varchar(100) | | Nomor referensi |
| receipt_number | varchar(50) | | Nomor receipt |
| description | text | | Deskripsi |
| recorded_by | uuid | FK → users.id | User pencatat |
| approved_by | uuid | FK → users.id | User approver |
| status | varchar(20) | DEFAULT 'completed' | Status |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_savings_trans_account`, `idx_savings_trans_date`

---

#### 3.6.3 cash_sessions (Sesi Kasir)

**Deskripsi**: Sesi kasir untuk cash closing

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| session_number | varchar(50) | NOT NULL, UNIQUE | Nomor sesi |
| cashier_id | uuid | FK → users.id, NOT NULL | Kasir |
| opening_balance | decimal(15,2) | NOT NULL | Saldo buka |
| opening_time | timestamptz | NOT NULL | Waktu buka |
| closing_balance | decimal(15,2) | | Saldo tutup |
| closing_time | timestamptz | | Waktu tutup |
| physical_cash | decimal(15,2) | | Uang fisik |
| difference | decimal(15,2) | DEFAULT 0 | Selisih |
| difference_status | varchar(20) | | balanced, over, short |
| status | varchar(20) | DEFAULT 'open' | Status |
| verified_by | uuid | FK → users.id | User verifier |
| verified_at | timestamptz | | Waktu verifikasi |
| notes | text | | Catatan |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

## 📈 STATISTICS (STATISTIK)

Statistics adalah read-only aggregated data, tidak perlu tabel baru. Data di-aggregate dari tabel operational.

---

## 🔔 NOTIFICATIONS (NOTIFIKASI)

#### 3.7.1 notifications (Notifikasi)

**Deskripsi**: Notifikasi sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| user_id | uuid | FK → users.id, NOT NULL | Penerima |
| title | varchar(255) | NOT NULL | Judul |
| message | text | NOT NULL | Pesan |
| type | varchar(50) | NOT NULL | info, success, warning, error, reminder, announcement, task, approval, system |
| priority | varchar(20) | DEFAULT 'normal' | low, normal, high, critical |
| module | varchar(50) | | Modul sumber |
| reference_id | uuid | | ID referensi |
| action_url | text | | URL aksi |
| read_status | boolean | DEFAULT false | Sudah dibaca |
| read_at | timestamptz | | Waktu baca |
| expires_at | timestamptz | | Kadaluarsa |
| metadata | jsonb | | Data tambahan |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_notifications_user`, `idx_notifications_unread`

---

#### 3.7.2 announcements (Pengumuman)

**Deskripsi**: Pengumuman sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| title | varchar(255) | NOT NULL | Judul |
| content | text | NOT NULL | Isi |
| audience | varchar(50) | NOT NULL | all_users, administrators, teachers, staff, students, custom |
| audience_roles | jsonb | | Role spesifik |
| audience_users | jsonb | | User spesifik |
| priority | varchar(20) | DEFAULT 'normal' | Prioritas |
| publish_date | timestamptz | | Tanggal publish |
| expiration_date | timestamptz | | Tanggal kadaluarsa |
| status | varchar(20) | DEFAULT 'draft' | Status |
| published_by | uuid | FK → users.id | User publisher |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

## 📁 DOCUMENTS (DOKUMEN)

#### 3.8.1 documents (Dokumen)

**Deskripsi**: Dokumen siswa dan sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| documentable_type | varchar(50) | NOT NULL | Student, SpecialUnit, dll |
| documentable_id | uuid | NOT NULL | ID owner |
| name | varchar(255) | NOT NULL | Nama dokumen |
| type | varchar(100) | | Tipe dokumen |
| file_url | text | NOT NULL | URL file |
| file_size | bigint | | Ukuran file (bytes) |
| mime_type | varchar(100) | | MIME type |
| description | text | | Deskripsi |
| uploaded_by | uuid | FK → users.id | User uploader |
| status | varchar(20) | DEFAULT 'active' | Status |
| created_at | timestamptz | DEFAULT now() | Timestamp |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

---

## 📋 IMPORT & EXPORT

#### 3.9.1 import_jobs (Job Import)

**Deskripsi**: Riwayat import data

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| module | varchar(50) | NOT NULL | Modul |
| file_name | varchar(255) | NOT NULL | Nama file |
| file_url | text | | URL file |
| strategy | varchar(50) | DEFAULT 'insert' | Strategy import |
| total_records | integer | | Total record |
| imported_count | integer | DEFAULT 0 | Jumlah diimport |
| updated_count | integer | DEFAULT 0 | Jumlah diupdate |
| skipped_count | integer | DEFAULT 0 | Jumlah dilewati |
| failed_count | integer | DEFAULT 0 | Jumlah gagal |
| status | varchar(20) | DEFAULT 'pending' | Status |
| error_report_url | text | | URL error report |
| started_at | timestamptz | | Mulai |
| completed_at | timestamptz | | Selesai |
| executed_by | uuid | FK → users.id | User executor |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

#### 3.9.2 export_jobs (Job Export)

**Deskripsi**: Riwayat export data

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| module | varchar(50) | NOT NULL | Modul |
| file_name | varchar(255) | NOT NULL | Nama file |
| file_url | text | | URL file |
| format | varchar(20) | NOT NULL | Format |
| total_records | integer | | Total record |
| filters | jsonb | | Filter yang digunakan |
| status | varchar(20) | DEFAULT 'pending' | Status |
| downloaded_at | timestamptz | | Waktu download |
| downloaded_by | uuid | FK → users.id | User downloader |
| executed_by | uuid | FK → users.id | User executor |
| created_at | timestamptz | DEFAULT now() | Timestamp |

---

## ⚙️ SETTINGS (PENGATURAN)

#### 3.10.1 settings (Pengaturan)

**Deskripsi**: Pengaturan aplikasi

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| category | varchar(50) | NOT NULL | Kategori |
| key | varchar(100) | NOT NULL | Key pengaturan |
| value | text | | Nilai |
| type | varchar(20) | DEFAULT 'string' | string, number, boolean, json |
| description | text | | Deskripsi |
| is_public | boolean | DEFAULT false | Apakah bisa dilihat user |
| updated_by | uuid | FK → users.id | User pengupdate |
| updated_at | timestamptz | DEFAULT now() | Timestamp |

**Unique Constraint**: `unique_setting` (category, key)

---

## 📝 AUDIT LOGS

#### 3.11.1 audit_logs (Log Audit)

**Deskripsi**: Log audit sistem

| Field | Type | Constraints | Deskripsi |
|-------|------|-------------|-----------|
| id | uuid | PK | Primary key |
| action | varchar(50) | NOT NULL | Aksi |
| module | varchar(50) | NOT NULL | Modul |
| entity | varchar(100) | | Entity |
| entity_id | uuid | | ID entity |
| old_value | jsonb | | Nilai lama |
| new_value | jsonb | | Nilai baru |
| description | text | | Deskripsi |
| ip_address | varchar(50) | | IP |
| user_agent | text | | User agent |
| user_id | uuid | FK → users.id | User |
| user_role | varchar(50) | | Role user |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Index**: `idx_audit_logs_module`, `idx_audit_logs_entity`, `idx_audit_logs_user`, `idx_audit_logs_date`

---

## 🔗 FOREIGN KEY CONSTRAINTS

### Master Tables (No Dependencies)
- academic_years
- semesters
- majors
- grades
- classes
- students
- parents
- users
- roles
- permissions

### Tables Depending on Master
```
students
  └── student_classes → classes, academic_years
  └── parents → students

users
  └── user_sessions → users
  └── login_history → users
  └── role_permissions → roles, permissions

classes
  └── classes → grades, majors, academic_years

attendances → students, classes, academic_years, semesters, users

assessment_sessions → templates, academic_years, semesters, classes, users
assessment_participants → sessions, students
student_scores → participants, items, users
score_history → scores, users

character_records → students, behavior_types, events, classes, users
character_summary → students, academic_years
counseling_recommendations → students, records, users

special_unit_members → units, students
special_unit_assignments → units, users
special_unit_training → units
special_unit_achievements → members

spiritual_participation → activities, students, users
spiritual_reflections → students, activities, users
spiritual_achievements → students

savings_accounts → students
savings_transactions → accounts, users
cash_sessions → users

notifications → users
announcements

documents

import_jobs → users
export_jobs → users

settings

audit_logs → users
```

---

## 📊 INDEX RECOMMENDATIONS

### Performance Indexes
```
students: email, status, name
classes: academic_year_id, grade_id, major_id
attendances: (student_id, date), class_id, date
student_scores: (participant_id, item_id), session_id
character_records: (student_id, date), behavior_type_id
audit_logs: created_at, module, entity_id
```

---

## 🔄 MIGRATION NOTES

### Creating Tables Order
1. Core tables first (academic_years, majors, grades, users, roles, permissions)
2. Then tables that depend on them
3. Then operational tables

### Important Notes
- Always add `created_at` and `updated_at` timestamps
- Use UUID for all primary keys
- Use soft delete (status = 'archived') instead of hard delete where possible
- Always add audit fields (created_by, updated_by)
- Use `timestamptz` for all timestamp fields

---

**Last Updated**: 2026-07-01
**Version**: 1.0
