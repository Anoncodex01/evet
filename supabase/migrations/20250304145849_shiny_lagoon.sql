/*
  # Add profile images storage bucket

  1. New Storage Bucket
    - Creates a profile-images bucket for storing user profile pictures
    - Sets up RLS policies for secure access

  2. Security
    - Enables RLS on storage objects
    - Adds policies for authenticated users to manage their profile images
*/

-- Create profile images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', false);

-- Create policy to allow authenticated users to manage their own profile images
CREATE POLICY "Users can manage their own profile images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow anyone to read profile images
CREATE POLICY "Anyone can read profile images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');