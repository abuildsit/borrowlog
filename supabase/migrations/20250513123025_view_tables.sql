-- Get table definition for profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- This is a read-only migration to check table structure
-- Add a dummy statement that doesn't modify anything to avoid migration errors
SELECT 1;
