/*
  # Approve Existing Providers
  
  1. Changes
    - Updates all existing providers to 'approved' status
    - Sets approved_at timestamp
    - Sets approved_by to admin user
*/

-- Get admin user ID
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@evet.co.tz'
  LIMIT 1;

  -- Update all existing providers to approved status
  UPDATE profiles
  SET 
    approval_status = 'approved',
    approved_at = NOW(),
    approved_by = admin_id
  WHERE 
    approval_status = 'pending' AND
    user_type IN ('daktari', 'duka', 'wauzaji');
END $$;