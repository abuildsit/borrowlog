-- First, drop existing RLS policies for the profiles table to start clean
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Disable RLS temporarily to fix any existing issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Fix any existing data issues (if there are duplicates or problematic rows)
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for profiles
-- Allow users to select their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Re-create the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists first to avoid duplicates
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = new.id) THEN
    INSERT INTO public.profiles (id, display_name)
    VALUES (new.id, COALESCE(new.email, 'New User'));
  END IF;
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error (Supabase logs can be viewed in the dashboard)
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is created only once
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add any missing profiles for existing users
INSERT INTO profiles (id, display_name)
SELECT id, email as display_name
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.users.id);

-- Grant permissions to authenticated users for the profiles table
GRANT ALL ON TABLE profiles TO authenticated;
