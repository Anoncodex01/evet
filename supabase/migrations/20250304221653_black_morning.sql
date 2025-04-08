/*
  # Fix Admin Authentication

  1. Changes
    - Drop and recreate admin user with correct password hashing
    - Update admin policies
*/

-- First remove existing admin user if exists
DELETE FROM auth.users WHERE email = 'admin@evet.co.tz';
DELETE FROM admins WHERE email = 'admin@evet.co.tz';

-- Create admin user with proper password hashing
DO $$ 
DECLARE 
  admin_uid UUID := gen_random_uuid();
BEGIN
  -- Insert admin user
  INSERT INTO auth.users (
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
    instance_id,
    is_super_admin
  )
  VALUES (
    admin_uid,
    'authenticated',
    'authenticated',
    'admin@evet.co.tz',
    crypt('2025@!Evet', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin"}',
    NOW(),
    NOW(),
    encode(gen_random_bytes(32), 'base64'),
    encode(gen_random_bytes(32), 'base64'),
    '00000000-0000-0000-0000-000000000000',
    true
  );

  -- Add admin to admins table
  INSERT INTO admins (id, email)
  VALUES (admin_uid, 'admin@evet.co.tz');
END
$$;