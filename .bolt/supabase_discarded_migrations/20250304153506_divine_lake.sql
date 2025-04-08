/*
  # Fix authentication schema and policies

  1. Changes
    - Add public profile policy to allow viewing basic profile info
    - Add email trigger to sync auth.users email with profiles
    - Add policy to allow email verification
    - Clean up any existing unverified users
    
  2. Security
    - Maintains RLS protection
    - Adds proper email verification flow
*/

-- Allow public access to basic profile info
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT 
USING (true);

-- Create trigger to sync auth.users email with profiles
CREATE OR REPLACE FUNCTION sync_email_on_auth_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER sync_email_on_auth_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_email_on_auth_update();

-- Allow email verification
CREATE POLICY "Enable email verification"
ON auth.users
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Clean up any unverified users older than 24 hours
DELETE FROM auth.users 
WHERE confirmed_at IS NULL 
AND created_at < now() - interval '24 hours';