-- NOTE: Creating buckets must be done through the Supabase dashboard or API
-- This migration sets up policies for buckets that should be created manually

-- Policies for avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow everyone to view avatars
CREATE POLICY "Allow public to view avatars"
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- Only allow users to update their own avatars
CREATE POLICY "Allow users to update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Only allow users to delete their own avatars
CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policies for loan-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('loan-photos', 'loan-photos', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Allow authenticated users to upload loan photos
CREATE POLICY "Allow authenticated users to upload loan photos"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'loan-photos');

-- Allow everyone to view loan photos
CREATE POLICY "Allow public to view loan photos"
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'loan-photos');

-- Only allow users to update their own loan photos
CREATE POLICY "Allow users to update their own loan photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'loan-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'loan-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Only allow users to delete their own loan photos
CREATE POLICY "Allow users to delete their own loan photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'loan-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
