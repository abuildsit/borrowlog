-- Create a function to bypass RLS and insert profiles directly
CREATE OR REPLACE FUNCTION create_profile_bypass_rls(
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT
) RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER -- This is important, it makes the function run with the privileges of the creator
AS $$
BEGIN
  -- Delete any existing profile with the same ID to avoid conflicts
  DELETE FROM profiles WHERE id = user_id;
  
  -- Insert the new profile
  RETURN QUERY
  INSERT INTO profiles (id, display_name, avatar_url, created_at, updated_at)
  VALUES (
    user_id, 
    display_name, 
    avatar_url,
    NOW(),
    NOW()
  )
  RETURNING *;
END;
$$;
