/*
  # Add status column to blog_posts table

  1. Changes
    - Add status column to blog_posts table with default value 'draft'
    - Add check constraint to ensure valid status values
    - Add index on status column for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add status column with check constraint
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'
CHECK (status IN ('draft', 'published', 'archived'));

-- Add index for status column
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Update existing posts to published status
UPDATE blog_posts SET status = 'published' WHERE status IS NULL;