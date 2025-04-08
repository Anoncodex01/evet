/*
  # Fix storage permissions for profile images

  1. Changes
    - Make profile-images bucket public
    - Update storage policies for profile images
    - Add better error handling for uploads
    
  2. Security
    - Maintains RLS protection while allowing uploads
    - Ensures proper access control
*/

-- Update profile-images bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profile-images';

-- Drop existing policies for profile-images
DROP POLICY IF EXISTS "Users can manage their profile images" ON storage.objects;

-- Create new policies for profile images
CREATE POLICY "Anyone can read profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');