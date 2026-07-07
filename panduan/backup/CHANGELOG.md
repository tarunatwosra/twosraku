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
