/*
  # Blog System Updates
  
  1. Changes
    - Add status column to blog_posts table
    - Add views column to track post views
    - Add likes column for post likes
    - Add published_at column to track when posts go live
    
  2. Security
    - Update RLS policies to handle new columns
    - Ensure proper access control for post management
*/

-- Add new columns to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Create index for status and published_at
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Update policies to handle status
DROP POLICY IF EXISTS "Anyone can read blog posts" ON blog_posts;
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can manage their own blog posts" ON blog_posts;
CREATE POLICY "Users can manage their own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id);