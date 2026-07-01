# Backup Panduan

## Apa Ini?

Folder ini berisi backup dari file-file panduan yang ada di `panduan/` atau `panduan/19-feature-specifications/`.

## Struktur

```
panduan/backup/
├── 19-feature-specifications/
│   ├── {file}-001.md    ← Backup TERBARUI (001 = terbaru)
│   ├── {file}-002.md
│   ├── {file}-003.md
│   ├── {file}-004.md
│   └── {file}-005.md    ← Backup TERLAMA (005 = terlama)
└── README.md             ← (file ini)
```

## Aturan Backup

| Aturan | Keterangan |
|--------|------------|
| **001 = terbaru** | Backup paling baru dari sebelum perubahan terakhir |
| **005 = terlama** | Backup paling lama |
| **Max 5 backup** | Jika sudah 5, yang terlama (005) dihapus, sisanya di-shift |

## Mekanisme Shift

```
Ada perubahan baru, sudah ada 5 backup:
  1. Hapus {file}-005.md
  2. Shift: 004→005, 003→004, 002→003, 001→002
  3. Buat {file}-001.md = copy isi file SEBELUM perubahan
```

## Cara Restore

Jika ingin mengembalikan ke versi backup:
1. Copy isi dari backup yang diinginkan (001-005)
2. Paste ke file asli di `panduan/` atau `panduan/19-feature-specifications/`

## Contoh Penggunaan

Misal ingin melihat perubahan tebal tabel dari waktu ke waktu:
- `fitur.md` = tebal tabel saat ini
- `fitur-001.md` = tebal tabel sebelum perubahan terakhir
- `fitur-002.md` = tebal tabel sebelum perubahan kedua
