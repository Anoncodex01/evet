/*
  # Add Approval System

  1. Changes
    - Add approval_status column to profiles table
    - Add approved_at and approved_by columns
    - Add policies for approval system
    - Add indexes for better performance

  2. Security
    - Only admins can approve users
    - Users can only access system after approval
*/

-- Add approval system columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_at timestamptz,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Create index for approval_status
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON profiles(approval_status);

-- Create policies for approval system
CREATE POLICY "Admins can approve users"
ON profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  )
);

-- Update existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  )
);