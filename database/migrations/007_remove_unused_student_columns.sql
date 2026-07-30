-- =============================================
-- Migration: Remove unused columns from students
-- =============================================
-- Date: 2026-07-30
-- Description: Hapus kolom yang tidak diperlukan untuk fitur buku induk
-- =============================================

-- Hapus kolom yang tidak diperlukan
ALTER TABLE students DROP COLUMN IF EXISTS national_id;
ALTER TABLE students DROP COLUMN IF EXISTS nationality;
ALTER TABLE students DROP COLUMN IF EXISTS email;
ALTER TABLE students DROP COLUMN IF EXISTS graduation_year;
ALTER TABLE students DROP COLUMN IF EXISTS transfer_date;
ALTER TABLE students DROP COLUMN IF EXISTS transfer_reason;

-- =============================================
-- VERIFICATION
-- =============================================

-- Cek struktur students setelah migration
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
