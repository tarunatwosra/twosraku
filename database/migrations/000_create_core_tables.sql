-- =============================================
-- SQL Migration: Create Core Tables
-- Tanggal: 2026-07-03
-- Deskripsi: Buat tabel-tabel inti untuk aplikasi
-- =============================================

-- =============================================
-- JALANKAN SETIAP STEP SECARA BERURUTAN
-- JIKA ADA ERROR, STOP DAN TUNGGU INSTRUKSI
-- =============================================

-- =============================================
-- STEP 1: ENABLE UUID EXTENSION
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- STEP 2: BUAT TABEL academic_years
-- =============================================
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_academic_years_is_active ON academic_years(is_active);

-- =============================================
-- STEP 3: BUAT TABEL semesters
-- =============================================
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(20) NOT NULL,
    semester_number INTEGER NOT NULL CHECK (semester_number IN (1, 2)),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_semesters_academic_year ON semesters(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_semesters_is_active ON semesters(is_active);

-- =============================================
-- STEP 4: BUAT TABEL majors
-- =============================================
CREATE TABLE IF NOT EXISTS majors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- STEP 5: BUAT TABEL grades
-- =============================================
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- STEP 6: BUAT TABEL classes
-- =============================================
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE NOT NULL,
    major_id UUID REFERENCES majors(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    room_number VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON classes(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_major ON classes(grade_id, major_id);

-- =============================================
-- STEP 7: BUAT TABEL students
-- =============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number VARCHAR(20) NOT NULL UNIQUE,
    nisn VARCHAR(20) UNIQUE,
    national_id VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birth_place VARCHAR(100),
    birth_date DATE,
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    blood_type VARCHAR(5),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    vision VARCHAR(20) DEFAULT 'normal',
    hearing VARCHAR(20) DEFAULT 'normal',
    teeth_condition VARCHAR(20) DEFAULT 'normal',
    physical_disability VARCHAR(20) DEFAULT 'none',
    illness_history TEXT,
    allergies TEXT,
    health_notes TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    enrollment_year INTEGER,
    graduation_year INTEGER,
    transfer_date DATE,
    transfer_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_students_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_nisn ON students(nisn);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_nisn_unique ON students(nisn) WHERE nisn IS NOT NULL;

-- =============================================
-- STEP 8: BUAT TABEL student_classes
-- =============================================
CREATE TABLE IF NOT EXISTS student_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    attendance_number INTEGER,
    is_homeroom BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_student_class_year
    ON student_classes(student_id, class_id, academic_year_id);

-- =============================================
-- STEP 9: BUAT TABEL parents
-- =============================================
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('father', 'mother', 'guardian')),
    full_name VARCHAR(255) NOT NULL,
    nik VARCHAR(20),
    birth_date DATE,
    occupation VARCHAR(100),
    education VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_primary BOOLEAN DEFAULT false,
    guardian_relation VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parents_student ON parents(student_id);

-- =============================================
-- STEP 10: INSERT SAMPLE DATA
-- =============================================

-- Insert sample academic year
INSERT INTO academic_years (name, start_date, end_date, is_active)
VALUES ('2025/2026', '2025-07-14', '2026-06-30', true)
ON CONFLICT DO NOTHING;

-- Insert semesters for current academic year
INSERT INTO semesters (academic_year_id, name, semester_number, start_date, end_date, is_active)
SELECT
    id,
    'Ganjil',
    1,
    '2025-07-14',
    '2025-12-31',
    true
FROM academic_years
WHERE name = '2025/2026'
AND NOT EXISTS (SELECT 1 FROM semesters WHERE academic_year_id = (SELECT id FROM academic_years WHERE name = '2025/2026') AND semester_number = 1);

-- Insert sample majors
INSERT INTO majors (name, code, description) VALUES
    ('Teknik Komputer dan Jaringan', 'TKJ', 'Teknik Komputer dan Jaringan'),
    ('Rekayasa Perangkat Lunak', 'RPL', 'Rekayasa Perangkat Lunak'),
    ('Multimedia', 'MM', 'Multimedia'),
    ('Akuntansi', 'AK', 'Akuntansi dan Keuangan Lembaga'),
    ('Otomatisasi dan Tata Kelola Perkantoran', 'OTKP', 'Otomatisasi dan Tata Kelola Perkantoran')
ON CONFLICT (code) DO NOTHING;

-- Insert sample grades
INSERT INTO grades (name, level) VALUES
    ('X', 10),
    ('XI', 11),
    ('XII', 12)
ON CONFLICT (level) DO NOTHING;

-- =============================================
-- STEP 11: RLS POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for development)
-- These policies allow anyone to read and write data

-- Academic Years
CREATE POLICY "Allow all access to academic_years"
    ON academic_years FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Semesters
CREATE POLICY "Allow all access to semesters"
    ON semesters FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Majors
CREATE POLICY "Allow all access to majors"
    ON majors FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Grades
CREATE POLICY "Allow all access to grades"
    ON grades FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Classes
CREATE POLICY "Allow all access to classes"
    ON classes FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Students
CREATE POLICY "Allow all access to students"
    ON students FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Student Classes
CREATE POLICY "Allow all access to student_classes"
    ON student_classes FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Parents
CREATE POLICY "Allow all access to parents"
    ON parents FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- SUCCESS!
-- Migration selesai. Refresh halaman aplikasi.
-- =============================================

-- Verifikasi dengan query ini di Supabase SQL Editor:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
