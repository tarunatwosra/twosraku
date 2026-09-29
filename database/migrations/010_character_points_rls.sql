-- ===========================================
-- CHARACTER POINTS RLS POLICIES
-- Jalankan di Supabase SQL Editor
-- ===========================================

-- 1. Enable RLS on character_categories
ALTER TABLE public.character_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all categories
CREATE POLICY "Allow authenticated users to read character_categories"
ON public.character_categories
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert categories
CREATE POLICY "Allow authenticated users to insert character_categories"
ON public.character_categories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update categories
CREATE POLICY "Allow authenticated users to update character_categories"
ON public.character_categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete categories
CREATE POLICY "Allow authenticated users to delete character_categories"
ON public.character_categories
FOR DELETE
TO authenticated
USING (true);

-- 2. Enable RLS on behavior_types
ALTER TABLE public.behavior_types ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all behavior types
CREATE POLICY "Allow authenticated users to read behavior_types"
ON public.behavior_types
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert behavior types
CREATE POLICY "Allow authenticated users to insert behavior_types"
ON public.behavior_types
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update behavior types
CREATE POLICY "Allow authenticated users to update behavior_types"
ON public.behavior_types
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete behavior types
CREATE POLICY "Allow authenticated users to delete behavior_types"
ON public.behavior_types
FOR DELETE
TO authenticated
USING (true);

-- 3. Enable RLS on character_records
ALTER TABLE public.character_records ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read character_records"
ON public.character_records
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert character_records"
ON public.character_records
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update character_records"
ON public.character_records
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete character_records"
ON public.character_records
FOR DELETE
TO authenticated
USING (true);

-- 4. Enable RLS on character_events
ALTER TABLE public.character_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read events
CREATE POLICY "Allow authenticated users to read character_events"
ON public.character_events
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert events
CREATE POLICY "Allow authenticated users to insert character_events"
ON public.character_events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update events
CREATE POLICY "Allow authenticated users to update character_events"
ON public.character_events
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete events
CREATE POLICY "Allow authenticated users to delete character_events"
ON public.character_events
FOR DELETE
TO authenticated
USING (true);

-- 5. Enable RLS on character_summary
ALTER TABLE public.character_summary ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read summaries
CREATE POLICY "Allow authenticated users to read character_summary"
ON public.character_summary
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update summaries
CREATE POLICY "Allow authenticated users to update character_summary"
ON public.character_summary
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Enable RLS on counseling_recommendations
ALTER TABLE public.counseling_recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read counseling recommendations
CREATE POLICY "Allow authenticated users to read counseling_recommendations"
ON public.counseling_recommendations
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert counseling recommendations
CREATE POLICY "Allow authenticated users to insert counseling_recommendations"
ON public.counseling_recommendations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update counseling recommendations
CREATE POLICY "Allow authenticated users to update counseling_recommendations"
ON public.counseling_recommendations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete counseling recommendations
CREATE POLICY "Allow authenticated users to delete counseling_recommendations"
ON public.counseling_recommendations
FOR DELETE
TO authenticated
USING (true);

-- ===========================================
-- INSERT SAMPLE DATA
-- ===========================================

-- Insert sample categories (only if table is empty)
INSERT INTO public.character_categories (name, description, color, display_order, status)
SELECT
  name, description, color, display_order, status
FROM (
  VALUES
    ('Disiplin', 'Ketepatan waktu, kedisiplinan dalam aturan sekolah', '#3B82F6', 1, 'active'),
    ('Tanggung Jawab', 'Mengambil tanggung jawab atas tindakan dan tugas', '#10B981', 2, 'active'),
    ('Kepemimpinan', 'Kemampuan memimpin dan menginspirasi', '#F59E0B', 3, 'active'),
    ('Sopan Santun', 'Perilaku sopan dan menghargai orang lain', '#EC4899', 4, 'active'),
    ('Integritas', 'Jujur dan dapat dipercaya', '#8B5CF6', 5, 'active'),
    ('Kerja Tim', 'Mampu bekerja sama dengan baik', '#06B6D4', 6, 'active')
) AS v(name, description, color, display_order, status)
WHERE NOT EXISTS (SELECT 1 FROM public.character_categories LIMIT 1);

-- Get category IDs for behavior insertion
DO $$
DECLARE
  cat_discipline_id uuid;
  cat_responsibility_id uuid;
  cat_leadership_id uuid;
  cat_courtesy_id uuid;
  cat_integrity_id uuid;
BEGIN
  SELECT id INTO cat_discipline_id FROM public.character_categories WHERE name = 'Disiplin' LIMIT 1;
  SELECT id INTO cat_responsibility_id FROM public.character_categories WHERE name = 'Tanggung Jawab' LIMIT 1;
  SELECT id INTO cat_leadership_id FROM public.character_categories WHERE name = 'Kepemimpinan' LIMIT 1;
  SELECT id INTO cat_courtesy_id FROM public.character_categories WHERE name = 'Sopan Santun' LIMIT 1;
  SELECT id INTO cat_integrity_id FROM public.character_categories WHERE name = 'Integritas' LIMIT 1;

  -- Insert sample behaviors (only if table is empty)
  IF NOT EXISTS (SELECT 1 FROM public.behavior_types LIMIT 1) THEN
    -- Disiplin behaviors
    INSERT INTO public.behavior_types (category_id, name, description, point_value, is_positive, severity, requires_approval, requires_counseling, status)
    VALUES
      (cat_discipline_id, 'Tepat Waktu', 'Mengikuti jadwal dengan baik', 10, true, 'minor', false, false, 'active'),
      (cat_discipline_id, 'Terlambat 5-15 Menit', 'Terlambat datang ke sekolah', -5, false, 'minor', false, false, 'active'),
      (cat_discipline_id, 'Terlambat >15 Menit', 'Terlambat lebih dari 15 menit', -10, false, 'moderate', true, false, 'active'),
      (cat_discipline_id, 'Seragam Tidak Lengkap', 'Tidak memakai seragam dengan lengkap', -10, false, 'minor', false, false, 'active'),

      -- Tanggung Jawab behaviors
      (cat_responsibility_id, 'Menyelesaikan Tugas Tepat Waktu', 'Tugas dikumpulkan sesuai deadline', 15, true, 'minor', false, false, 'active'),
      (cat_responsibility_id, 'Tidak Menyelesaikan Tugas', 'Tidak mengerjakan tugas yang diberikan', -10, false, 'minor', false, false, 'active'),
      (cat_responsibility_id, 'Menjaga Kebersihan', 'Menjaga kebersihan area kerja', 5, true, 'minor', false, false, 'active'),

      -- Kepemimpinan behaviors
      (cat_leadership_id, 'Menjadi Komandan', 'Berperan sebagai komandan kelompok', 20, true, 'minor', false, false, 'active'),
      (cat_leadership_id, 'Inisiatif Positif', 'Mengambil inisiatif untuk kebaikan bersama', 25, true, 'moderate', true, false, 'active'),

      -- Sopan Santun behaviors
      (cat_courtesy_id, 'Menghormati Guru', 'Menunjukkan sikap hormat kepada guru', 10, true, 'minor', false, false, 'active'),
      (cat_courtesy_id, 'Berkata Kasar', 'Menggunakan kata-kata tidak sopan', -20, false, 'moderate', true, true, 'active'),
      (cat_courtesy_id, 'Membantu Sesama', 'Membantu teman yang kesulitan', 15, true, 'minor', false, false, 'active'),

      -- Integritas behaviors
      (cat_integrity_id, 'Jujur', 'Mengaku kesalahan sendiri tanpa provokasi', 15, true, 'minor', false, false, 'active'),
      (cat_integrity_id, 'Menyontek', 'Melakukan kecurangan dalam ujian', -50, false, 'major', true, true, 'active');
  END IF;
END $$;

-- ===========================================
-- VERIFY
-- ===========================================
SELECT 'character_categories' as table_name, count(*) as row_count FROM public.character_categories
UNION ALL
SELECT 'behavior_types', count(*) FROM public.behavior_types
UNION ALL
SELECT 'character_records', count(*) FROM public.character_records;
