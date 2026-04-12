/*
  # Setup Photos Storage Bucket

  1. Storage Setup
    - Create photos bucket if it doesn't exist
    - Set bucket to public for read access
    - Configure proper RLS policies for authenticated users

  2. Security
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Restrict delete/update to authenticated users
*/

-- Create the photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Create storage policies using the storage schema functions
-- These policies will be applied to the storage.objects table

-- Policy for authenticated users to upload files
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can upload to photos bucket" ON storage.objects;
  
  -- Create new policy for uploads
  CREATE POLICY "Authenticated users can upload to photos bucket"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'photos' AND
      auth.uid() IS NOT NULL
    );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- Policy for public read access
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
  
  -- Create new policy for public reads
  CREATE POLICY "Public can view photos"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'photos');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- Policy for authenticated users to update their files
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can update photos" ON storage.objects;
  
  -- Create new policy for updates
  CREATE POLICY "Authenticated users can update photos"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'photos' AND
      auth.uid() IS NOT NULL
    )
    WITH CHECK (
      bucket_id = 'photos' AND
      auth.uid() IS NOT NULL
    );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- Policy for authenticated users to delete files
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can delete photos" ON storage.objects;
  
  -- Create new policy for deletes
  CREATE POLICY "Authenticated users can delete photos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'photos' AND
      auth.uid() IS NOT NULL
    );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;