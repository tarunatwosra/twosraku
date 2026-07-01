# 📁 Database Folder - Twosraku

Folder ini berisi dokumentasi dan script untuk database Supabase.

---

## 📄 File Overview

| File | Deskripsi |
|------|----------|
| [schema.md](schema.md) | Dokumentasi lengkap semua tabel database |
| [supabase-setup.sql](supabase-setup.sql) | SQL script untuk membuat semua tabel |
| [README.md](README.md) | File ini |

---

## 🚀 Cara Setup Database

### Langkah 1: Buat Project di Supabase

1. Buka [supabase.com](https://supabase.com)
2. Buat project baru
3. Catat credentials Anda (URL, anon key, service role key)

### Langkah 2: Buat .env.local

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dan isi credentials Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Langkah 3: Buat Tabel di Supabase

1. Buka Supabase Dashboard → **SQL Editor**
2. Klik **New Query**
3. Copy isi dari [supabase-setup.sql](supabase-setup.sql)
4. Paste ke SQL Editor
5. Klik **Run** (F5)

### Langkah 4: Verifikasi

Setelah SQL berhasil dijalankan, cek di **Table Editor** untuk melihat semua tabel yang sudah dibuat.

---

## 📊 Urutan Tabel (sesuai dependensi)

```
Level 1: Core Tables (tanpa dependensi)
├── academic_years
├── semesters
├── majors
├── grades
├── users
└── roles

Level 2: Tables dengan dependensi
├── classes (depends on grades, majors, academic_years)
├── students (depends on users)
├── student_classes (depends on students, classes, academic_years)
├── parents (depends on students)
├── user_sessions (depends on users)
└── login_history (depends on users)

Level 3: Operational Tables
├── attendances
├── assessment_categories, assessment_templates, assessment_items
├── assessment_sessions, assessment_participants, student_scores
├── character_categories, behavior_types, character_events
├── character_records, character_summary
├── special_units, special_unit_positions, special_unit_members
├── special_unit_assignments, special_unit_training
├── spiritual_activities, spiritual_participation, spiritual_reflections
├── savings_accounts, savings_transactions, cash_sessions
├── notifications, announcements
├── documents
├── import_jobs, export_jobs
├── settings
└── audit_logs
```

---

## 🔍 Cara Baca schema.md

File `schema.md` adalah dokumentasi lengkap yang berisi:

- **Deskripsi tabel** - Apa fungsi tabel
- **Field definitions** - Nama field, type, constraints
- **Business rules** - Aturan bisnis dari spesifikasi fitur
- **Indexes** - Index untuk performa query
- **Foreign keys** - Relasi antar tabel

### Contoh Penggunaan

```typescript
// Baca schema.md untuk tahu struktur tabel
// Misalnya, tabel students punya field:
// - id (uuid)
// - student_number (varchar)
// - full_name (varchar)
// - gender (varchar)
// - dll

// Lalu gunakan di kode:
const { data } = await supabase
  .from('students')
  .select('*')
  .eq('status', 'active')
```

---

## 🔄 Sinkronisasi schema.md dengan Database

Jika Anda mengubah struktur database langsung di Supabase:

1. **Update schema.md** - Tambahkan/edit field yang berubah
2. **Catat perubahan** - Tulis di changelog pribadi

Jika Anda mengubah dari kode:
1. **Buat migration script baru** (future feature)
2. **Update schema.md** dengan perubahan

---

## ⚠️ Penting

- **JANGAN commit** `.env.local` ke Git
- **Selalu backup** sebelum perubahan besar
- **schema.md adalah source of truth** - Pastikan selalu sinkron

---

## 📝 Checklist Setup

- [ ] Buat project Supabase
- [ ] Buat .env.local dari .env.local.example
- [ ] Isi credentials Supabase
- [ ] Jalankan supabase-setup.sql
- [ ] Verifikasi semua tabel dibuat
- [ ] Test koneksi dari aplikasi

---

**Last Updated**: 2026-07-01
