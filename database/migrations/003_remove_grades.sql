-- =============================================
-- Migration: Remove grades table
-- =============================================
-- Date: 2026-07-05
-- Description: Hapus tabel grades karena tidak digunakan
--              Kolom grade_id di classes juga dihapus
-- =============================================

-- =============================================
-- 1. Hapus foreign key constraint di classes
-- =============================================

-- Pertama, cek apakah constraint ada
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_grade_id_fkey;

-- Hapus kolom grade_id dari classes
ALTER TABLE classes DROP COLUMN IF EXISTS grade_id;

-- =============================================
-- 2. Hapus tabel grades (jika ada data, akan error)
-- =============================================

-- Opsional: Set null atau delete data terlebih dahulu
-- DROP TABLE IF EXISTS grades CASCADE;

-- =============================================
-- VERIFICATION
-- =============================================

-- Cek struktur classes setelah migration
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- Pastikan grade_id tidak ada lagi
SELECT 'grade_id exists' as check_result
FROM information_schema.columns
WHERE table_name = 'classes' AND column_name = 'grade_id';

-- =============================================
-- NOTES
-- =============================================
-- 1. Jalankan setelah backup data
-- 2. Jika ada kelas yang bergantung pada grades, hapus/ubah dulu
-- 3. Pastikan aplikasi sudah diupdate untuk tidak menggunakan grades
