/*
  # Fix blog storage configuration

  1. Changes
    - Create blog-images bucket with proper configuration
    - Set up correct storage policies for blog images
    - Add RLS policies for authenticated users
*/

-- Create blog-images bucket with proper configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create storage policies with proper permissions
CREATE POLICY "Anyone can read blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can manage blog images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Create blog_posts table if not exists
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create blog_posts policies
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id);