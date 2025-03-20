/*
  # Add public_url column to documents table

  1. Changes
    - Add public_url column to documents table to store publicly accessible URLs
    - Make document_url nullable to support different storage scenarios
    - Add validation check for public_url format

  2. Security
    - Maintain existing RLS policies
*/

-- Add public_url column
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS public_url text,
ALTER COLUMN document_url DROP NOT NULL;

-- Add check constraint for URL format
ALTER TABLE documents
ADD CONSTRAINT valid_public_url 
CHECK (
  public_url IS NULL OR 
  public_url ~* '^https?://[^\s/$.?#].[^\s]*$'
);