-- =============================================
-- Migration: Remove academic_year_id and room_number from classes
-- =============================================
-- Date: 2026-07-30
-- Description: Classes tidak lagi terikat tahun ajaran.
--              Siswa terikat tahun ajaran melalui student_classes.
--              Room number dihapus karena tidak diperlukan.
-- =============================================

-- =============================================
-- 1. Hapus foreign key constraint academic_year_id di classes
-- =============================================

-- Cek apakah constraint ada
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_academic_year_id_fkey;

-- Hapus kolom academic_year_id dari classes
ALTER TABLE classes DROP COLUMN IF EXISTS academic_year_id;

-- =============================================
-- 2. Hapus kolom room_number dari classes
-- =============================================

ALTER TABLE classes DROP COLUMN IF EXISTS room_number;

-- =============================================
-- VERIFICATION
-- =============================================

-- Cek struktur classes setelah migration
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- =============================================
-- NOTES
-- =============================================
-- 1. Jalankan setelah backup data
-- 2. Data siswa tetap terhubung ke kelas melalui tabel student_classes
-- 3. student_classes memiliki academic_year_id untuk menghubungkan
--    siswa ke tahun ajaran tertentu
-- 4. Aplikasi sudah diupdate untuk tidak menggunakan kolom ini
