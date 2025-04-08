/*
  # Fix storage policies for profile images

  1. Changes
    - Update profile-images bucket configuration
    - Fix storage policies for authenticated users
    - Allow public access to profile images
    - Remove user-specific folder requirements

  2. Security
    - Enable proper access control
    - Maintain public read access
*/

-- Ensure profile-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop all existing policies for profile-images bucket
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;

-- Create simplified policies for profile images
CREATE POLICY "Allow public read access to profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated users to manage profile images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'profile-images')
WITH CHECK (bucket_id = 'profile-images');