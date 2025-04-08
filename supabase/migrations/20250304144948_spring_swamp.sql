/*
  # Create storage buckets for document uploads

  1. New Storage Buckets
    - `documents`: For storing user documents like certifications and licenses
    - Public access disabled, only authenticated users can access their own documents

  2. Security
    - Enable RLS on storage.objects
    - Add policy for authenticated users to manage their own documents
*/

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to manage their own documents
CREATE POLICY "Users can manage their own documents"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to read their own documents
CREATE POLICY "Users can read their own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);