/*
  # Add published_at column to blog_posts table

  1. Changes
    - Add published_at column to blog_posts table
    - Set published_at to current timestamp for existing published posts
    - Add index on published_at column for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add published_at column
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Set published_at for existing published posts
UPDATE blog_posts 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;

-- Add index for published_at column
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);