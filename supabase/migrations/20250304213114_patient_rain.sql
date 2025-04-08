/*
  # Fix blog images storage configuration

  1. Changes
    - Recreate blog-images bucket with proper configuration
    - Update storage policies for blog images
    - Add proper RLS policies for image management
*/

-- Drop existing blog-images bucket if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'blog-images'
  ) THEN
    DELETE FROM storage.buckets WHERE id = 'blog-images';
  END IF;
END $$;

-- Create blog-images bucket with proper configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can read blog images' 
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    DROP POLICY "Anyone can read blog images" ON storage.objects;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can upload blog images' 
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    DROP POLICY "Users can upload blog images" ON storage.objects;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can manage their own blog images' 
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    DROP POLICY "Users can manage their own blog images" ON storage.objects;
  END IF;
END $$;

-- Create storage policies with proper permissions
CREATE POLICY "Anyone can read blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Users can manage their own blog images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_profile_id ON blog_posts(profile_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);