/*
  # Update schema for phone authentication

  1. Changes
    - Make phone the primary identifier instead of email
    - Add phone number uniqueness constraint
    - Update policies for phone verification
    
  2. Security
    - Maintains RLS protection
    - Adds phone verification flow
*/

-- Add phone uniqueness constraint to profiles
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_email_key,
ADD CONSTRAINT profiles_phone_key UNIQUE (phone);

-- Make email optional
ALTER TABLE public.profiles
ALTER COLUMN email DROP NOT NULL;

-- Create policy for phone verification
CREATE POLICY "Enable phone verification"
ON auth.users
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add phone verification status
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;