# Panduan Changelog

Berisi catatan semua perubahan yang dilakukan pada file-file panduan. Setiap kali ada perubahan fitur yang berbeda dari dokumentasi, backup akan dicatat di sini.

---

## Format Entry

```markdown
### {nama-file}.md ({subfolder}/)
| Field | Value |
|-------|-------|
| Tanggal | YYYY-MM-DD |
| Perubahan | Deskripsi perubahan |
| Backup | {nama-file}-001.md |
| Catatan | (opsional) |
```

---

## Catatan

- **001 = backup terbaru** - Isi sebelum perubahan terakhir
- **Shift otomatis** - Jika sudah 5 backup, yang terlama dihapus
- Lihat isi backup di `panduan/backup/19-feature-specifications/` atau `panduan/backup/`

---

<!-- Changelog entries will be added below this line -->

## 2026-07-10 (Import Enhancement)

### student-registry.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-10 |
| Perubahan | ENHANCED IMPORT FEATURE v2.0: (1) Tambahkan tombol "Import Siswa" di halaman utama buku induk. (2) Dry Run Mode - validasi data tanpa mengubah database. (3) Import Strategy Options - Insert, Update, Upsert, Skip. (4) Field Mapping Editor - auto-detect kolom dengan manual mapping. (5) Conflict Resolution UI - deteksi & tampilkan NIS duplikat. (6) Template download dengan 25+ kolom (termasuk data orang tua & kesehatan). |
| Backup | student-registry-001.md |
| Catatan | Files: app/buku-induk/page.tsx, app/buku-induk/import/page.tsx, lib/import/student-import.ts |

## 2026-07-08 (Afternoon - Penggabungan Formula)

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | REFACTOR v6.0: (1) Gabungkan Formula ke halaman Pusat Penilaian (card terpisah). (2) Hapus folder: template, session, kategori, formula (tetap dihapus). (3) Update sidebar - hapus link ke halaman yang dihapus. (4) Update panduan dengan navigation structure baru. |
| Backup | assessment-001.md |
| Catatan | Formula sekarang tampil dalam card di bawah Kategori |

## 2026-07-08 (Typography Revision)

### 02-design-tokens.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | Typography System v2.0 - Complete overhaul: (1) Revisi hierarki font sizes: H3=22px, H4=18px, H5=16px, H6=15px. (2) Body text: 15px→14px. (3) Caption: 13px→12px. (4) Added utility classes: text-stat-lg (28px), text-stat-md (22px), text-stat-sm (18px), text-body, text-body-sm, text-caption, text-tiny, text-section-title. (5) Migration guide ditambahkan. |
| Backup | 02-design-tokens-001.md |
| Catatan | Files updated: globals.css, semua page.tsx di modul (Tabungan, Presensi, Penilaian, Poin Karakter, Spiritual, Laporan, Import-Export, Pasukan Khusus, Settings, dll) |

## 2026-07-08 (Morning - Updated)

### attendance.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | UI/UX REFACTOR v2.1 FINAL: (1) Card wrappers untuk semua sections (Header, Filter, Summary). (2) Consistent spacing: p-4/p-5 cards, space-y-6 sections. (3) Fix hooks order bug di kelas/[id] page. (4) Print & Export features. (5) Realistic dummy data dengan weekend handling. (6) Layout structure diagrams ditambahkan. |
| Backup | attendance-001.md (v2.1 sebelumnya), attendance-002.md (v1.0) |
| Catatan | Files: page.tsx, input/page.tsx, rekap/page.tsx, kelas/[id]/page.tsx, hooks/useAttendance.ts |

## 2026-07-08 (Morning)

### attendance.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | UI/UX REFACTOR v2.0: (1) Alur disederhanakan: Tahun Ajaran & Semester auto dari Settings (dihapus dari UI). (2) Status HSIA (Hadir, Sakit, Ijin, Alpa) - hapus Terlambat. (3) Default semua Hadir. (4) Pilih tanggal default hari ini. (5) Filter tab di halaman input. (6) UI diselaraskan dengan student-registry patterns. |
| Backup | attendance-001.md |
| Catatan | Refactor UI halaman: /presensi, /presensi/input, /presensi/rekap, /presensi/kelas/[id] |

## 2026-07-08 (Late Night)

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | CLEANUP v7.0 FINAL: (1) Hapus folder /penilaian/input (fungsi sudah dipindahkan ke Quick Score). (2) Hapus link "Input Nilai" dari sidebar. (3) Verifikasi semua data sudah dari Supabase. (4) Update status implementasi di panduan. |
| Backup | assessment-001.md (shifted from previous) |
| Catatan | Quick Score sudah lengkap dengan filter Kategori→Periode→Kelas dari database |

## 2026-07-08 (Night)

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | QUICK SCORE v7.0: (1) Hapus halaman input penilaian lama ([id]/[periodId]/page.tsx). (2) Tambah filter Kelas di Quick Score (setelah filter Periode). (3) Ubah input dari card menjadi tabel. (4) Tambah kolom hasil kategori di kanan. (5) 1 tombol Simpan Semua (hapus simpan per siswa). |
| Backup | assessment-001.md |
| Catatan | File input penilaian dihapus |

## 2026-07-08 (Malam)

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | QUICK SCORE ENHANCEMENT v6.0: (1) Template "Kerajinan Tangan" ditambahkan (3rd template). (2) Fitur inline item creation di Quick Score page dengan modal untuk tambah item baru. (3) Per-student save dengan badge "Tersimpan". (4) File structure diupdate dengan quick/page.tsx. |
| Backup | assessment-001.md |
| Catatan | Backup sebelumnya di-shift: 001→002 |

## 2026-07-08 (Sore)

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | FEATURE UPDATE v5.0: (1) Quick Score page baru (/penilaian/quick) untuk input langsung tanpa setup. (2) Template presets di modal Kategori Baru (Jasmani Standar, PBB Mingguan, Kerajinan Tangan). (3) Inline item creation di halaman Quick Score. (4) Update navigation sidebar dengan Quick Score. (5) Navigation structure di panduan diupdate. |
| Backup | - |
| Catatan | File baru: app/penilaian/quick/page.tsx |

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-08 |
| Perubahan | UI REFACTOR: (1) Versi naik ke 5.0. (2) UI diselaraskan dengan Buku Induk patterns: Elevated cards dengan gradient decoration, Avatar dengan warna dinamis, Stat pills dengan rounded-full, Modal dengan backdrop-blur dan rounded-3xl, Form fields dengan rounded-2xl dan focus ring. (3) Helper components baru: InfoItem, StatCard, StatPill, WeightProgressBar, GradeLegend, CategoryCard, StudentCard. (4) Part 7 diupdate dengan UI Design Patterns baru. |
| Backup | assessment-001.md |
| Catatan | 5 file penilaian di-refactor: page.tsx, [id]/page.tsx, [id]/[periodId]/page.tsx, formula/page.tsx, input/page.tsx |

## 2026-07-07

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-07 |
| Perubahan | REFACTOR MAJOR: (1) Arsitektur baru: Kategori → Items + Periods → Scores → Nilai Kategori → Formula → Nilai Rapor. (2) Hapus Template & Session, ganti dengan Periods. (3) Items dengan input_type, conversion_type, conversion_value untuk konversi otomatis. (4) Formula untuk kombinasi Nilai Kategori + modul lain. (5) UI disederhanakan: 5 halaman → 2 halaman (Assessment Center + Formula). |
| Backup | assessment-001.md |
| Catatan | Migration 005_create_new_assessment_system.sql sudah dibuat |

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-07 |
| Perubahan | Update schema fields: (1) `locked` → `is_locked` di session. (2) `required` → `is_required` di item. (3) TypeScript types diupdate sesuai schema Supabase. (4) Pages diupdate menggunakan property baru. (5) Hook useAssessment diupdate. |
| Backup | assessment-001.md |
| Catatan | Sinkronisasi schema TypeScript dengan Supabase |

### assessment.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-07 |
| Perubahan | Implementasi lengkap Assessment Module: (1) API Routes dengan Supabase (11 file). (2) Hook useAssessment.ts dengan CRUD operations. (3) CRUD halaman Kategori. (4) CRUD halaman Template + Items. (5) CRUD halaman Session + Lock/Unlock. (6) Input Nilai dengan spreadsheet-style. |
| Backup | assessment-001.md |
| Catatan | Implementasi menggunakan Supabase, bukan Prisma. Schema sudah ada di Supabase.

### student-registry.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-07 |
| Perubahan | (1) Tab Detail Siswa digabungkan: "Informasi Pribadi" + "Data Akademik" → "Data Pribadi & Akademik", "Data Orang Tua" + "Wali" → "Data Orang Tua & Wali". Total tab 9 → 7. (2) Info Sections wrapper menggunakan elevated style (white background) agar konsisten dengan tab lain. |
| Backup | student-registry-001.md |
| Catatan | Backup dilakukan setelah perubahan kode; backup sebelumnya tetap di 001 |

## 2026-07-06

### student-registry.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-06 |
| Perubahan | Refactor UI buku induk: (1) Daftar Siswa - border minimal, hover lift effect, filter bar soft styling. (2) Detail Siswa - pill tabs, elevated header, modern timeline. (3) Form - soft grouped sections, modern focus/error states. (4) Quick View Modal - slide-in dari kanan. (5) Empty & Loading states dengan skeleton. |
| Backup | student-registry-001.md |
| Catatan | Backup sebelumnya (v2.0 sebelum refactor UI) di-shift ke 001; versi lama dipindahkan ke 005 |

### component-library.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-06 |
| Perubahan | Update dokumentasi: Tabs sekarang pill-style, Timeline dengan dot indicators, Button hover dengan lift effect, Card shadow lebih soft |
| Backup | (minor documentation update, tidak perlu backup) |
| Catatan | Perubahan UI dilakukan di kode, panduan diupdate untuk mencerminkan |

### data-table.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-06 |
| Perubahan | Update styling guidelines: border-less table, ultra-tipis divider lines, hover dengan translateY(-1px), filter bar dengan soft background |
| Backup | (minor documentation update, tidak perlu backup) |
| Catatan | Sinkron dengan implementasi refactor UI buku induk |

---

## 2026-07-05

### schema.md (database)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-05 |
| Perubahan | Hapus referensi grades di tabel classes. Tabel grades dihapus, informasi tingkat diambil dari nama kelas. Update Foreign Key Constraints dan Index Recommendations. |
| Backup | schema-001.md |
| Catatan | Migration 003_remove_grades.sql sudah dibuat untuk menghapus grade_id |

### settings.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-05 |
| Perubahan | Hapus referensi tab Tingkat (Grades). Changelog diupdate untuk mencerminkan perubahan: Majors dan Classes tanpa Grades. |
| Backup | settings-001.md |
| Catatan | Backup sebelumnya di-shift: 003→004, 002→003, 001→002 |

### types/database.ts
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-05 |
| Perubahan | Hapus referensi Grade di StudentWithClass interface. |
| Backup | (minor type change, tidak perlu backup) |
| Catatan | - |

---

## 2026-07-03

### settings.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | UPDATE: Menghapus tab Tingkat dan Semester. Tab Academic sekarang hanya memiliki: Tahun Ajaran, Sistem Penilaian, Jurusan, Kelas. Semester ditangani secara lokal oleh masing-masing modul (absensi, penilaian). |
| Backup | settings-003.md |
| Catatan | - |

---

## 2026-07-03

### student-registry.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Update struktur form Edit Siswa agar sama dengan Tambah Siswa (5 section: Data Diri, Akademik, Orang Tua/Wali, Fisik & Kesehatan, Lainnya). Status badge di history page menggunakan `is_active` (boolean). |
| Backup | student-registry-003.md |
| Catatan | Backup sebelum perubahan form edit |

---

## 2026-07-03

### student-registry.md (19-feature-specifications/) [PREVIOUS]
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Update lengkap Student Registry Module v2.0: (1) Status siswa disederhanakan dari `status` (varchar) menjadi `is_active` (boolean) dengan nilai Aktif/Tidak Aktif. (2) Ditambah field baru: nisn, vision, hearing, teeth_condition, physical_disability, illness_history, allergies, health_notes, guardian_relation. (3) Form tambah/edit siswa lengkap dengan 5 section: Data Diri, Akademik, Orang Tua/Wali, Fisik & Kesehatan, Lainnya. |
| Backup | student-registry-002.md |
| Catatan | Backup sebelum update schema dan form |

---

## 2026-07-03

### student-registry.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Update lengkap Student Registry Module v2.0: (1) Status siswa disederhanakan dari `status` (varchar) menjadi `is_active` (boolean) dengan nilai Aktif/Tidak Aktif. (2) Ditambah field baru: nisn, vision, hearing, teeth_condition, physical_disability, illness_history, allergies, health_notes, guardian_relation. (3) Form tambah/edit siswa lengkap dengan 5 section: Data Diri, Akademik, Orang Tua/Wali, Fisik & Kesehatan, Lainnya. |
| Backup | student-registry-001.md |
| Catatan | Backup sebelum update schema dan form |

---

## 2026-07-03

### layout-system.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Judul halaman dipindahkan ke Header (bukan di konten utama). Dashboard menampilkan greeting "Selamat pagi...", halaman lain menampilkan judul + deskripsi. Sorting dropdown dihapus, integrasikan ke header kolom tabel. |
| Backup | layout-system-002.md |
| Catatan | Backup sebelum page title consolidation |

### component-library.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Button variants diupdate: Primary (solid blue #2563EB, no shadow), Secondary (light bg + thin border), Outline (transparent bg + subtle border #E2E8F0, hover reveals darker), Ghost (fully transparent). Semua shadow dihapus. Hover effect: translateY(-1px). |
| Backup | component-library-001.md |
| Catatan | Update dokumentasi button sesuai implementasi inline styles |

### button.tsx (component)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Implementasi inline styles untuk button variants. Primary: solid blue bg, no shadow. Outline/Ghost: subtle border, hover reveals darker. CSS reset globals.css diperbaiki (hapus border: none, background: none dari button). |
| Catatan | Solusi untuk button style yang tidak applied karena CSS reset |

---

## 2026-07-03

### navigation.md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | User menu dipindahkan dari header ke sidebar: tambah dropdown dengan email, pengaturan, profil, logout. Top navigation tidak lagi punya user menu. |
| Backup | navigation-002.md |
| Catatan | Backup sebelum user menu consolidation |

---

## 2026-07-03

### layout-system(1).md
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Sidebar redesign: full-height (no margin), width 280→240px, collapsed 88→64px, flat edge (no radius), collapse button in header, logo clickable when collapsed |
| Backup | layout-system(1)-001.md |
| Catatan | Backup sebelum sidebar redesign |

### navigation.md (previous update)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Sidebar redesign: layout, width, collapse behavior, header structure |
| Backup | navigation-001.md |
| Catatan | Sinkron dengan layout-system(1) |

---

## 2026-07-03

### reports.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-03 |
| Perubahan | Implementasi lengkap Reports Module v2.0 |
| Backup | reports-001.md |
| Catatan | Backup dokumentasi sebelum implementasi |

---
