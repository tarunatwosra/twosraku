-- =============================================
-- SQL Migration: Add RLS Policies for Assessment Tables
-- Tanggal: 2026-07-07
-- Deskripsi: Tambahkan RLS policies untuk assessment_categories, assessment_templates,
--            assessment_items, assessment_sessions, assessment_participants, dan student_scores
-- =============================================

-- =============================================
-- STEP 1: Assessment Categories Policies
-- =============================================
CREATE POLICY "Allow all access to assessment_categories"
    ON assessment_categories FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 2: Assessment Templates Policies
-- =============================================
CREATE POLICY "Allow all access to assessment_templates"
    ON assessment_templates FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 3: Assessment Items Policies
-- =============================================
CREATE POLICY "Allow all access to assessment_items"
    ON assessment_items FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 4: Assessment Sessions Policies
-- =============================================
CREATE POLICY "Allow all access to assessment_sessions"
    ON assessment_sessions FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 5: Assessment Participants Policies
-- =============================================
CREATE POLICY "Allow all access to assessment_participants"
    ON assessment_participants FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 6: Student Scores Policies
-- =============================================
CREATE POLICY "Allow all access to student_scores"
    ON student_scores FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 7: Additional Assessment Related Tables
-- =============================================

-- Score History
CREATE POLICY "Allow all access to score_history"
    ON score_history FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Grade Conversions
CREATE POLICY "Allow all access to grade_conversions"
    ON grade_conversions FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- SUCCESS!
-- Jalankan di Supabase SQL Editor
-- Refresh halaman aplikasi untuk verifikasi
-- =============================================
