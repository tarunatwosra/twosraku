-- =============================================
-- SQL Migration: Students Table Update
-- Tanggal: 2026-07-03
-- Status: SUDAH BERHASIL DILAKUKAN
-- =============================================

-- =============================================
-- KOLOM BARU YANG DITAMBAHKAN
-- =============================================

-- 1. is_active (boolean) - untuk status aktif/tidak aktif siswa
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. nisn (varchar) - Nomor Induk Sekolah Nasional
ALTER TABLE students ADD COLUMN IF NOT EXISTS nisn VARCHAR(20);

-- 3. Field kesehatan
ALTER TABLE students ADD COLUMN IF NOT EXISTS vision VARCHAR(20) DEFAULT 'normal';
ALTER TABLE students ADD COLUMN IF NOT EXISTS hearing VARCHAR(20) DEFAULT 'normal';
ALTER TABLE students ADD COLUMN IF NOT EXISTS teeth_condition VARCHAR(20) DEFAULT 'normal';
ALTER TABLE students ADD COLUMN IF NOT EXISTS physical_disability VARCHAR(20) DEFAULT 'none';
ALTER TABLE students ADD COLUMN IF NOT EXISTS illness_history TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS health_notes TEXT;

-- =============================================
-- KOLOM YANG DIHAPUS
-- =============================================

-- status (varchar) - sudah digantikan dengan is_active (boolean)
-- Jalankan hanya jika kolom masih ada:
-- ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
-- ALTER TABLE students DROP COLUMN IF EXISTS status;

-- =============================================
-- UPDATE TABEL parents
-- =============================================

-- guardian_relation (varchar) - hubungan wali
ALTER TABLE parents ADD COLUMN IF NOT EXISTS guardian_relation VARCHAR(50);

-- =============================================
-- INDEX BARU
-- =============================================

CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_nisn_unique ON students(nisn) WHERE nisn IS NOT NULL;

-- =============================================
-- CATATAN
-- =============================================

-- Schema sudah ter-update sesuai hasil migrasi.
-- Semua kolom baru sudah ada di database.
-- Default values sudah diset:
--   - is_active: true
--   - vision: 'normal'
--   - hearing: 'normal'
--   - teeth_condition: 'normal'
--   - physical_disability: 'none'

-- =============================================
-- ROLLBACK (jika perlu)
-- =============================================
/*
-- Tambahkan kembali kolom status lama:
ALTER TABLE students ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Update status dari is_active:
UPDATE students SET status = CASE
    WHEN is_active = true THEN 'active'
    ELSE 'archived'
END;

-- Hapus kolom baru:
ALTER TABLE students DROP COLUMN IF EXISTS is_active;
ALTER TABLE students DROP COLUMN IF EXISTS nisn;
ALTER TABLE students DROP COLUMN IF EXISTS vision;
ALTER TABLE students DROP COLUMN IF EXISTS hearing;
ALTER TABLE students DROP COLUMN IF EXISTS teeth_condition;
ALTER TABLE students DROP COLUMN IF EXISTS physical_disability;
ALTER TABLE students DROP COLUMN IF EXISTS illness_history;
ALTER TABLE students DROP COLUMN IF EXISTS allergies;
ALTER TABLE students DROP COLUMN IF EXISTS health_notes;

-- Hapus dari parents:
ALTER TABLE parents DROP COLUMN IF EXISTS guardian_relation;

-- Hapus index:
DROP INDEX IF EXISTS idx_students_is_active;
DROP INDEX IF EXISTS idx_students_nisn_unique;
*/
