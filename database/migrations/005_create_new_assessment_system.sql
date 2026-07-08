-- =============================================
-- SQL Migration: Create New Assessment System Tables
-- Tanggal: 2026-07-07
-- Deskripsi: Buat tabel baru untuk sistem penilaian dengan:
-- - Kategori (Jasmani, PBB, dll)
-- - Periode (Jan, Apr, Jul, Okt)
-- - Items dengan konversi otomatis
-- - Formula & Nilai Rapor
-- =============================================

-- =============================================
-- JALANKAN SETIAP STEP SECARA BERURUTAN
-- =============================================

-- =============================================
-- STEP 1: UPDATE assessment_categories
-- Hapus kolom yang tidak diperlukan,
-- tambahkan yang baru jika perlu
-- =============================================

-- Tabel categories sudah ada, kita hanya perlu memastikan strukturnya sesuai
-- Kita akan pakai struktur yang sudah ada

-- =============================================
-- STEP 2: UPDATE assessment_items
-- Ubah dari template-based ke category-based
-- =============================================

-- Drop foreign key ke templates dulu
ALTER TABLE assessment_items DROP CONSTRAINT IF EXISTS assessment_items_template_id_fkey;

-- Ubah template_id menjadi category_id
ALTER TABLE assessment_items RENAME COLUMN template_id TO category_id;

-- Tambahkan kolom baru untuk konversi
ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS input_type VARCHAR(20) DEFAULT 'number';
ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS conversion_type VARCHAR(20) DEFAULT 'direct';
ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS conversion_value TEXT;
ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update input_type values: 'count', 'time', 'number', 'percentage', 'boolean'
-- Update conversion_type: 'direct', 'multiply', 'lookup_table', 'formula'

-- =============================================
-- STEP 3: BUAT TABEL assessment_periods
-- Periode penilaian (Januari, April, Juli, Oktober)
-- =============================================

CREATE TABLE IF NOT EXISTS assessment_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES assessment_categories(id) ON DELETE CASCADE NOT NULL,
    period_name VARCHAR(50) NOT NULL,
    period_order INTEGER NOT NULL DEFAULT 1,
    start_date DATE,
    end_date DATE,
    weight_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_periods_category ON assessment_periods(category_id);
CREATE INDEX IF NOT EXISTS idx_periods_order ON assessment_periods(period_order);

-- =============================================
-- STEP 4: BUAT TABEL assessment_period_scores
-- Nilai per item per siswa per periode
-- =============================================

CREATE TABLE IF NOT EXISTS assessment_period_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_id UUID REFERENCES assessment_periods(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES assessment_items(id) ON DELETE CASCADE NOT NULL,
    raw_input TEXT,
    converted_score DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(period_id, student_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_period_scores_period ON assessment_period_scores(period_id);
CREATE INDEX IF NOT EXISTS idx_period_scores_student ON assessment_period_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_period_scores_item ON assessment_period_scores(item_id);

-- =============================================
-- STEP 5: BUAT TABEL assessment_category_scores
-- Nilai akhir kategori per siswa (dari semua periode)
-- =============================================

CREATE TABLE IF NOT EXISTS assessment_category_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES assessment_categories(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    total_score DECIMAL(5,2),
    grade VARCHAR(5),
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, category_id, academic_year_id, semester_id)
);

CREATE INDEX IF NOT EXISTS idx_category_scores_student ON assessment_category_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_category_scores_category ON assessment_category_scores(category_id);
CREATE INDEX IF NOT EXISTS idx_category_scores_academic_year ON assessment_category_scores(academic_year_id);

-- =============================================
-- STEP 6: BUAT TABEL assessment_formulas
-- Formula = kombinasi Nilai Kategori + konversi modul
-- =============================================

CREATE TABLE IF NOT EXISTS assessment_formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE SET NULL,
    components JSONB NOT NULL DEFAULT '[]',
    -- components format:
    -- [{"type": "category", "id": "uuid", "weight": 50}, {"type": "module", "module": "attendance", "weight": 30}]
    total_weight DECIMAL(5,2) DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_formulas_academic_year ON assessment_formulas(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_formulas_status ON assessment_formulas(status);

-- =============================================
-- STEP 7: BUAT TABEL assessment_rapor
-- Nilai Rapor = penjumlahan semua formula
-- =============================================

CREATE TABLE IF NOT EXISTS assessment_rapor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    formulas JSONB DEFAULT '{}',
    -- formulas format: {"formula_id": score, "formula_id2": score2}
    formula_values JSONB DEFAULT '{}',
    -- formula_values format: {"formula_id": {"name": "Formula 1", "score": 85, "weight": 50}}
    total_score DECIMAL(5,2),
    grade VARCHAR(5),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, academic_year_id, semester_id)
);

CREATE INDEX IF NOT EXISTS idx_rapor_student ON assessment_rapor(student_id);
CREATE INDEX IF NOT EXISTS idx_rapor_academic_year ON assessment_rapor(academic_year_id);

-- =============================================
-- STEP 8: BUAT TABEL attendance_conversion_rules
-- Aturan konversi presensi ke nilai
-- =============================================

CREATE TABLE IF NOT EXISTS attendance_conversion_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source_field VARCHAR(50) NOT NULL,
    -- source_field: 'attendance_rate', 'total_present', 'sick_days', 'permission_days', 'absent_days'
    lookup_table JSONB NOT NULL DEFAULT '{}',
    -- lookup_table: {"100": 100, "95": 95, "90": 90, ...}
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- STEP 9: RLS POLICIES BARU
-- =============================================

-- Enable RLS on new tables
ALTER TABLE assessment_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_period_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_rapor ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_conversion_rules ENABLE ROW LEVEL SECURITY;

-- Policy untuk assessment_periods
CREATE POLICY "Allow all access to assessment_periods"
    ON assessment_periods FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy untuk assessment_period_scores
CREATE POLICY "Allow all access to assessment_period_scores"
    ON assessment_period_scores FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy untuk assessment_category_scores
CREATE POLICY "Allow all access to assessment_category_scores"
    ON assessment_category_scores FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy untuk assessment_formulas
CREATE POLICY "Allow all access to assessment_formulas"
    ON assessment_formulas FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy untuk assessment_rapor
CREATE POLICY "Allow all access to assessment_rapor"
    ON assessment_rapor FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy untuk attendance_conversion_rules
CREATE POLICY "Allow all access to attendance_conversion_rules"
    ON attendance_conversion_rules FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 10: INSERT SAMPLE DATA
-- =============================================

-- Sample conversion rules untuk attendance
INSERT INTO attendance_conversion_rules (name, description, source_field, lookup_table) VALUES
    ('Konversi Kehadiran', 'Konversi persentase kehadiran ke nilai', 'attendance_rate',
     '{"100": 100, "99": 99, "98": 98, "97": 97, "96": 96, "95": 95, "94": 94, "93": 93, "92": 92, "91": 91, "90": 90, "89": 89, "88": 88, "87": 87, "86": 86, "85": 85, "84": 84, "83": 83, "82": 82, "81": 81, "80": 80, "79": 78, "78": 76, "77": 74, "76": 72, "75": 70, "74": 68, "73": 66, "72": 64, "71": 62, "70": 60, "69": 58, "68": 56, "67": 54, "66": 52, "65": 50, "64": 48, "63": 46, "62": 44, "61": 42, "60": 40}'),
    ('Konversi Total Hadir', 'Konversi total hari hadir ke nilai', 'total_present',
     '{"200": 100, "195": 98, "190": 95, "185": 92, "180": 90, "175": 88, "170": 85, "165": 82, "160": 80, "155": 78, "150": 75}')
ON CONFLICT DO NOTHING;

-- =============================================
-- STEP 11: UPDATE existing assessment_items
-- Set input_type dan conversion_type untuk item yang ada
-- =============================================

UPDATE assessment_items
SET input_type = 'number',
    conversion_type = 'direct',
    display_order = COALESCE(display_order, 0)
WHERE input_type IS NULL OR input_type = '';

-- =============================================
-- STEP 12: TRIGGER untuk updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to new tables
DROP TRIGGER IF EXISTS update_assessment_periods_updated_at ON assessment_periods;
CREATE TRIGGER update_assessment_periods_updated_at
    BEFORE UPDATE ON assessment_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_period_scores_updated_at ON assessment_period_scores;
CREATE TRIGGER update_assessment_period_scores_updated_at
    BEFORE UPDATE ON assessment_period_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_category_scores_updated_at ON assessment_category_scores;
CREATE TRIGGER update_assessment_category_scores_updated_at
    BEFORE UPDATE ON assessment_category_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_formulas_updated_at ON assessment_formulas;
CREATE TRIGGER update_assessment_formulas_updated_at
    BEFORE UPDATE ON assessment_formulas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_rapor_updated_at ON assessment_rapor;
CREATE TRIGGER update_assessment_rapor_updated_at
    BEFORE UPDATE ON assessment_rapor
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_conversion_rules_updated_at ON attendance_conversion_rules;
CREATE TRIGGER update_attendance_conversion_rules_updated_at
    BEFORE UPDATE ON attendance_conversion_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SUCCESS!
-- Migration selesai. Jalankan di Supabase SQL Editor.
-- =============================================

-- Verifikasi dengan query ini:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name LIKE 'assessment_%' OR table_name LIKE 'attendance_conversion%'
-- ORDER BY table_name;
