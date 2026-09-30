-- =============================================
-- SQL Migration: Create Student Documents & Activity Logs
-- Tanggal: 2026-09-02
-- Deskripsi: Buat tabel student_documents, storage bucket, dan activity_logs
-- =============================================

-- =============================================
-- STEP 1: BUAT TABEL student_documents
-- =============================================
CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'photo',
        'birth_certificate',
        'family_card',
        'national_id',
        'graduation_certificate',
        'report_card',
        'transfer_letter',
        'medical_record',
        'other'
    )),
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    updated_by UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_type ON student_documents(type);
CREATE INDEX IF NOT EXISTS idx_student_documents_created_at ON student_documents(created_at DESC);

-- =============================================
-- STEP 2: ENABLE RLS ON student_documents
-- =============================================
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- Policy untuk akses anon (development)
CREATE POLICY "Allow all access to student_documents"
    ON student_documents FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 3: BUAT TABEL activity_logs
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'student', 'class', 'attendance', dll
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'archive', 'restore'
    changes JSONB, -- Menyimpan perubahan { field: { old: x, new: y } }
    description TEXT, -- Deskripsi human-readable
    performed_by UUID, -- User yang melakukan
    performed_by_name VARCHAR(255), -- Nama user (cached untuk audit trail)
    performed_by_role VARCHAR(50), -- Role user
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_performed_by ON activity_logs(performed_by);

-- =============================================
-- STEP 4: ENABLE RLS ON activity_logs
-- =============================================
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy untuk akses anon (development)
CREATE POLICY "Allow all access to activity_logs"
    ON activity_logs FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- =============================================
-- STEP 5: CREATE STORAGE BUCKET
-- =============================================
-- Catatan: Bucket dibuat via Supabase Dashboard atau CLI
-- Jalankan perintah ini di Supabase CLI atau via Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'student-documents',
--     'student-documents',
--     false,
--     20971520, -- 20MB
--     ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 6: STORAGE POLICIES
-- =============================================
-- Jalankan di Supabase Dashboard > Storage > Policies

-- Policy untuk bucket student-documents:
-- 1. Allow authenticated users to upload
-- 2. Allow anyone to read (public URL)
-- 3. Allow owner to delete their files

-- =============================================
-- SUCCESS!
-- Migration selesai.
-- =============================================

-- Verifikasi:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('student_documents', 'activity_logs');
