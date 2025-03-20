/*
  # Remove Approval System
  
  1. Changes
    - Removes approval_status column
    - Removes approved_at column
    - Removes approved_by column
    - Removes approval-related policies
    - Updates existing policies
*/

-- Drop approval-related policies
DROP POLICY IF EXISTS "Admins can approve users" ON profiles;

-- Drop approval-related columns
ALTER TABLE profiles 
DROP COLUMN IF EXISTS approval_status,
DROP COLUMN IF EXISTS approved_at,
DROP COLUMN IF EXISTS approved_by;

-- Drop approval status index
DROP INDEX IF EXISTS idx_profiles_approval_status;

-- Update existing policies to remove approval checks
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