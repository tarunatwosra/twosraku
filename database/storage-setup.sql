-- =============================================
-- SQL: Create Storage Bucket for Student Documents
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Insert storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'student-documents',
    'student-documents',
    false,
    20971520, -- 20MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for student-documents bucket

-- Policy: Allow anyone to upload files (authenticated users)
CREATE POLICY "Allow authenticated users to upload to student-documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'student-documents'
);

-- Policy: Allow anyone to read files from student-documents
CREATE POLICY "Allow anyone to read student-documents"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id = 'student-documents'
);

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Allow users to update their own student documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'student-documents'
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Allow users to delete their own student documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'student-documents'
);

-- Note: For development, you may want to allow anon uploads too
-- Uncomment the following if needed:

-- Policy: Allow anon uploads (for development)
CREATE POLICY "Allow anon uploads to student-documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
    bucket_id = 'student-documents'
);

-- Policy: Allow anon deletes (for development)
CREATE POLICY "Allow anon deletes from student-documents"
ON storage.objects
FOR DELETE
TO anon
USING (
    bucket_id = 'student-documents'
);
