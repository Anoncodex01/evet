/*
  # Fix storage policies for profile images and documents

  1. Changes
    - Drop existing storage policies
    - Create new simplified policies for profile images
    - Add proper bucket management policies
    - Fix RLS for authenticated users

  2. Security
    - Enable proper access control for authenticated users
    - Maintain public read access for profile images
    - Ensure proper file path validation
*/

-- Ensure buckets exist with correct settings
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'profile-images', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

-- Drop all existing storage policies
DROP POLICY IF EXISTS "Allow public read access to profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to manage profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their documents" ON storage.objects;

-- Create new storage policies for profile images
CREATE POLICY "Anyone can read profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can manage their profile images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policies for documents
CREATE POLICY "Authenticated users can manage their documents"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);