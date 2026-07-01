# Twosraku - Panduan Proyek

## Context Utama

Selalu baca dan gunakan folder **panduan/** sebagai referensi utama untuk setiap tugas.

### Struktur Panduan

```
panduan/
├── 01-design-principles.md         # Prinsip desain
├── 02-design-tokens.md             # Design tokens & variabel
├── 03-layout-system.md             # Sistem layout
├── 04-component-library.md         # Library komponen UI
├── 05-navigation.md               # Navigasi & routing
├── 06-dashboard.md                # Halaman dashboard
├── 07-form-guidelines.md           # Guidelines form
├── 08-data-table.md               # Komponen tabel data
├── 09-page-patterns.md             # Pattern halaman
├── 10-motion.md                   # Animasi & transisi
├── 11-accessibility.md             # Aksesibilitas
├── 12-icons.md                     # Guideline ikon
├── 13-charts.md                    # Komponen chart
├── 14-authentication.md           # Autentikasi
├── 15-claude-rules.md             # Aturan untuk Claude Code
├── 16-architecture.md             # Arsitektur aplikasi
├── 17-development-workflow.md     # Workflow pengembangan
├── 18-coding-standards.md         # Standar kode
├── 19-feature-specifications/      # Spesifikasi fitur
│   ├── README.md
│   ├── Special-Units.md
│   ├── assessment.md
│   ├── attendance.md
│   ├── authentication.md
│   ├── character-points.md
│   ├── dashboard.md
│   ├── global-search.md
│   ├── import-export.md
│   ├── notifications.md
│   ├── reports.md
│   ├── savings.md
│   ├── settings.md
│   ├── spiritual.md
│   ├── statistics.md
│   └── student-registry.md
├── 20-ai-context.md               # Context untuk AI
└── backup/                         # Backup panduan (lihat aturan di bawah)
    ├── CHANGELOG.md                 # Index/catatan semua perubahan
    ├── README.md                    # Dokumentasi sistem backup
    └── 19-feature-specifications/
        └── {nama-file}-001.md s/d -005.md
```

---

## 📋 Aturan Wajib

1. **Baca panduan relevan SEBELUM** membuat perubahan atau membuat fitur baru
2. **Ikuti pattern yang ada** di panduan - jangan inventasi cara baru jika sudah ada pattern
3. **Konsisten dengan design tokens** yang sudah didefinisikan
4. **Gunakan komponen** dari library yang sudah ada sebelum membuat komponen baru
5. **Ikuti coding standards** yang sudah ditetapkan

---

## 🔄 Sistem Update Panduan Otomatis

Setiap kali melakukan **perubahan fitur** yang **berbeda** dari yang tertulis di panduan, WAJIG update panduan terkait dan WAJIB backup.

### Alur Kerja Lengkap

```
1. Baca panduan terkait SEBELUM membuat perubahan
2. Buat perubahan di kode
3. Bandingkan dengan panduan:
   ├── Sama → Tidak perlu update panduan
   └── Berbeda → Lanjut ke step 4
4. BACKUP:
   a. Cek apakah sudah ada backup 001-005
   b. Jika 005 ada → hapus 005
   c. Shift: 004→005, 003→004, 002→003, 001→002
   d. Copy file asli → {nama}-001.md
   e. Tambah entry di CHANGELOG.md
5. UPDATE:
   a. Update file panduan asli dengan teknis terbaru
6. LAPORKAN:
   a. Beritahu user perubahan apa yang di-backup
   b. Beritahu backup mana yang affected
```

### Contoh Respons Setelah Perubahan

Setelah selesai membuat perubahan, WAJIB laporkan dengan format:

```markdown
---

## 📋 Update Panduan

| Item | Detail |
|------|--------|
| File | `savings.md` |
| Perubahan | Tabel tebal 7 → 5 |
| Backup dibuat | `savings-001.md` |
| Lokasi backup | `panduan/backup/19-feature-specifications/` |

📝 Catatan: Panduan `savings.md` telah diupdate dengan tebal tabel 5. Backup sebelumnya tersimpan di `savings-001.md`.
```

### Kapan Perlu Backup?

| Situasi | Perlu Backup? |
|---------|---------------|
| Perubahan sesuai panduan | ❌ Tidak |
| Perubahan berbeda dari panduan | ✅ Ya |
| Menambah fitur baru yang tidak ada di panduan | ✅ Ya |
| Menghapus fitur dari panduan | ✅ Ya |
| Perbaikan typo di panduan saja | ❌ Tidak |

### Struktur CHANGELOG

File `panduan/backup/CHANGELOG.md` mencatat setiap backup yang dibuat:

```markdown
## 2026-07-01

### savings.md (19-feature-specifications/)
| Field | Value |
|-------|-------|
| Tanggal | 2026-07-01 |
| Perubahan | Tabel tebal 7 → 5 |
| Backup | savings-001.md |
| Catatan | - |

---

<!-- entry baru ditambahkan di atas ini -->
```

### Struktur Backup

```
panduan/
├── 19-feature-specifications/
│   └── savings.md                  ← File panduan AKTIF (selalu yang terkini)
└── backup/
    └── 19-feature-specifications/
        ├── savings-001.md          ← Backup TERBARUI (001 = terbaru)
        ├── savings-002.md          ← Backup kedua
        ├── savings-003.md          ← Backup ketiga
        ├── savings-004.md          ← Backup keempat
        └── savings-005.md          ← Backup TERLAMA (005 = terlama)
```

### Cara Backup Bekerja

**Contoh: Ubah tabel tebal 7 → 5**

```
SEBELUM:
  fitur.md              = tabel tebal 7

SESUDAH:
  fitur.md              = tabel tebal 5       ← Selalu yang terkini
  fitur-001.md          = tabel tebal 7       ← Backup terbaru
```

**Contoh: Perubahan kedua (header warna warni)**

```
SEBELUM:
  fitur.md              = tabel tebal 5
  fitur-001.md          = tabel tebal 7

SESUDAH:
  fitur.md              = header warna warni + tebal 5   ← Selalu yang terkini
  fitur-001.md          = tabel tebal 5                   ← Backup terbaru
  fitur-002.md          = tabel tebal 7                   ← Backup lama
```

### Aturan Backup

| Aturan | Keterangan |
|--------|------------|
| **Lokasi** | `panduan/backup/19-feature-specifications/` |
| **Format nama** | `{nama-file}-001.md` s/d `{nama-file}-005.md` |
| **001 = terbaru** | Backup paling baru dari sebelum perubahan |
| **005 = terlama** | Backup paling lama |
| **Max 5 backup** | Jika sudah ada 5, hapus yang 005 duluan, shift semua |

### Mekanisme Max 5 Backup

```
Sudah ada 5 backup (001-005), ada perubahan baru:
  1. Hapus {file}-005.md (terlama)
  2. Shift: 004→005, 003→004, 002→003, 001→002
  3. Buat {file}-001.md = copy isi file SEBELUM perubahan
```

### Backup File di Root panduan/

Jika file panduan ada di root `panduan/` (bukan di subfolder), backup ke:
```
panduan/backup/
├── CHANGELOG.md
└── {nama-file}-001.md s/d -005.md
```

> **Catatan:** Semua backup (baik dari root maupun subfolder) dicatat di `CHANGELOG.md` yang sama.

---

## 🏗️ Struktur Proyek

- [src/](src/) - Source code aplikasi
- [panduan/](panduan/) - Dokumentasi panduan (WAJIB DIBACA)
- [tests/](tests/) - Unit & integration tests
- [public/](public/) - Static assets

## Catatan Penting

- Twosraku adalah aplikasi Flutter (mobile-first)
- Menggunakan Clean Architecture
- Selalu konsultasikan panduan terkait sebelum mengimplementasi fitur baru
