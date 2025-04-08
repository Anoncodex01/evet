/*
  # Fix blog images bucket and policies

  1. Changes
    - Create blog-images bucket if not exists
    - Set bucket to public
    - Add storage policies for blog images
*/

-- Create blog-images bucket if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'blog-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('blog-images', 'blog-images', true);
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read blog images'
  ) THEN
    DROP POLICY "Anyone can read blog images" ON storage.objects;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload blog images'
  ) THEN
    DROP POLICY "Users can upload blog images" ON storage.objects;
  END IF;
END $$;

-- Create storage policies
CREATE POLICY "Anyone can read blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Users can update their own blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);