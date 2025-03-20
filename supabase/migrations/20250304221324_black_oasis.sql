/*
  # Fix Admin Authentication

  1. Changes
    - Create admin user with proper authentication
    - Add admin role and policies
    - Set up admin permissions
*/

-- Create admin role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
END
$$;

-- Create admin user if not exists
DO $$ 
DECLARE 
  admin_uid UUID;
BEGIN
  -- Check if admin already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@evet.co.tz'
  ) THEN
    -- Insert admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@evet.co.tz',
      crypt('2025@!Evet', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO admin_uid;

    -- Add admin to admins table
    INSERT INTO admins (id, email)
    VALUES (admin_uid, 'admin@evet.co.tz');
  END IF;
END
$$;

-- Grant necessary permissions to admin role
GRANT USAGE ON SCHEMA public TO admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Create or replace admin policies
CREATE POLICY "Allow full access for admins"
ON profiles
FOR ALL
TO admin
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow full access for admins"
ON blog_posts
FOR ALL
TO admin
USING (true)
WITH CHECK (true);