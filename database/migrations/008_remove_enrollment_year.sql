-- =============================================
-- SQL Migration: Remove enrollment_year column
-- Tanggal: 2026-07-31
-- Deskripsi: Hapus kolom enrollment_year dari tabel students
-- karena informasi tahun ajaran sudah dikelola via academic_years dan student_classes
-- =============================================

-- =============================================
-- JALANKAN DI SUPABASE SQL EDITOR
-- JIKA ADA ERROR, STOP DAN TUNGGU INSTRUKSI
-- =============================================

-- =============================================
-- STEP 1: Hapus kolom enrollment_year dari students
-- =============================================
ALTER TABLE students DROP COLUMN IF EXISTS enrollment_year;

-- =============================================
-- STEP 2: Verifikasi perubahan
-- =============================================
-- Jalankan query ini untuk memastikan kolom sudah dihapus:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'students' AND column_name = 'enrollment_year';
-- Hasil harus kosong (0 rows)

-- =============================================
-- STEP 3: Verifikasi kolom yang tersisa di students
-- =============================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'students'
-- ORDER BY ordinal_position;

-- =============================================
-- SUCCESS!
-- Migration selesai. Kolom enrollment_year sudah dihapus.
-- Informasi tahun ajaran sekarang diambil dari academic_years (is_active = true)
-- dan dikelola via tabel student_classes.
-- =============================================
