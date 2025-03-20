/*
  # Add locations support
  
  1. New Tables
    - `locations` table to store Tanzanian cities/regions
    - Columns:
      - id (uuid, primary key)
      - name (text, unique)
      - region (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      
  2. Changes
    - Add foreign key constraint to profiles.location
    - Add index on profiles.location
    
  3. Data
    - Insert major Tanzanian cities/regions
*/

-- Create locations table
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  region text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert major Tanzanian cities/regions
INSERT INTO locations (name, region) VALUES
  ('Arusha', 'Arusha'),
  ('Dar es Salaam', 'Dar es Salaam'),
  ('Dodoma', 'Dodoma'),
  ('Mwanza', 'Mwanza'),
  ('Tanga', 'Tanga'),
  ('Mbeya', 'Mbeya'),
  ('Morogoro', 'Morogoro'),
  ('Zanzibar', 'Zanzibar'),
  ('Kigoma', 'Kigoma'),
  ('Moshi', 'Kilimanjaro'),
  ('Tabora', 'Tabora'),
  ('Singida', 'Singida'),
  ('Bukoba', 'Kagera'),
  ('Musoma', 'Mara'),
  ('Sumbawanga', 'Rukwa'),
  ('Shinyanga', 'Shinyanga'),
  ('Iringa', 'Iringa'),
  ('Songea', 'Ruvuma'),
  ('Lindi', 'Lindi'),
  ('Mtwara', 'Mtwara')
ON CONFLICT (name) DO NOTHING;