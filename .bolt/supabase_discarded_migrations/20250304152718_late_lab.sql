/*
  # Create profiles and related tables
  
  1. Tables
    - profiles: Stores user profile information
    - documents: Stores document references
    - listings: Stores service listings
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for data access control
    
  3. Triggers
    - Adds updated_at triggers
*/

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('daktari', 'duka', 'wauzaji')),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  location text,
  description text,
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table if not exists
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('license', 'certification', 'business_permit')),
  document_url text,
  public_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_public_url CHECK (public_url IS NULL OR public_url ~* '^https?://[^\s/$.?#].[^\s]*$')
);

-- Create listings table if not exists
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  type text NOT NULL CHECK (type IN ('DAKTARI', 'DUKA', 'WAUZAJI')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  rating numeric(2,1) CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for documents
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own documents"
  ON public.documents
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Create policies for listings
CREATE POLICY "Anyone can view active listings"
  ON public.listings
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can manage their own listings"
  ON public.listings
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();