-- =============================================
-- SQL Migration: Fix Attendance Table
-- Tanggal: 2026-08-05
-- Deskripsi:
--   1. Add UNIQUE constraint for (student_id, class_id, date) to support multi-class scenarios
--   2. Add RLS policies for attendances table
-- =============================================

-- STEP 1: Drop existing unique constraint if it exists and add new one
-- First, check if the old constraint exists
DO $$
BEGIN
    -- Try to drop the old unique constraint (will error if doesn't exist, which is fine)
    ALTER TABLE attendances DROP CONSTRAINT IF EXISTS attendances_student_id_date_key;
EXCEPTION WHEN OTHERS THEN
    -- Ignore error if constraint doesn't exist
    RAISE NOTICE 'Old constraint may not exist: %', SQLERRM;
END $$;

-- Add new unique constraint that includes class_id for multi-class support
-- Note: We use a different approach - create a unique index instead of constraint
DROP INDEX IF EXISTS idx_attendances_student_date CASCADE;
CREATE UNIQUE INDEX idx_attendances_student_class_date
    ON attendances(student_id, class_id, date);

-- STEP 2: Enable RLS if not already enabled
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create RLS policies for attendances table
-- Allow authenticated users to read all attendance records
CREATE POLICY "Allow authenticated users to read attendances"
    ON attendances FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert attendance records
CREATE POLICY "Allow authenticated users to insert attendances"
    ON attendances FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update attendance records
CREATE POLICY "Allow authenticated users to update attendances"
    ON attendances FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete attendance records (soft delete by setting status)
CREATE POLICY "Allow authenticated users to delete attendances"
    ON attendances FOR DELETE
    TO authenticated
    USING (true);

-- For development: Allow anonymous access (remove in production!)
CREATE POLICY "Allow anonymous access to attendances"
    ON attendances FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- VERIFICATION
-- =============================================
-- Run this to check the constraints:
-- SELECT conname FROM pg_constraint WHERE conrelid = 'attendances'::regclass;

-- Run this to check the RLS policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'attendances';
