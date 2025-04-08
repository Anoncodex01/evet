/*
  # Create storage buckets for profile images and documents
  
  1. Storage Buckets
    - Creates public bucket for profile images
    - Creates private bucket for documents
  
  2. Security
    - Enables RLS on storage.objects
    - Adds policies for authenticated users to manage their files
    - Allows public read access to profile images
*/

-- Create profile images bucket if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'profile-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('profile-images', 'profile-images', true);
  END IF;
END $$;

-- Create documents bucket if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'documents'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('documents', 'documents', false);
  END IF;
END $$;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for profile images management
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their profile images'
  ) THEN
    CREATE POLICY "Users can manage their profile images"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'profile-images');
  END IF;
END $$;

-- Create policy for documents management
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their documents'
  ) THEN
    CREATE POLICY "Users can manage their documents"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;