/*
  # Fix Admin User Creation

  1. Changes
    - Create admin user with correct password hashing
    - Set up proper admin role and permissions
*/

-- Create admin user with proper password hashing
DO $$ 
DECLARE 
  admin_uid UUID;
BEGIN
  -- Check if admin already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@evet.co.tz'
  ) THEN
    -- Insert admin user with proper password hashing
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
      recovery_token,
      is_super_admin
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@evet.co.tz',
      -- Use proper password hashing function
      crypt('2025@!Evet', gen_salt('bf', 10)),
      NOW(),
      jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
      ),
      jsonb_build_object(
        'role', 'admin'
      ),
      NOW(),
      NOW(),
      encode(gen_random_bytes(32), 'base64'),
      encode(gen_random_bytes(32), 'base64'),
      true
    )
    RETURNING id INTO admin_uid;

    -- Add admin to admins table
    INSERT INTO admins (id, email)
    VALUES (admin_uid, 'admin@evet.co.tz');
  END IF;
END
$$;

-- Ensure admin policies exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow full access for admins' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Allow full access for admins"
    ON profiles
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.id = auth.uid()
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow full access for admins' 
    AND tablename = 'blog_posts'
  ) THEN
    CREATE POLICY "Allow full access for admins"
    ON blog_posts
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.id = auth.uid()
      )
    );
  END IF;
END
$$;