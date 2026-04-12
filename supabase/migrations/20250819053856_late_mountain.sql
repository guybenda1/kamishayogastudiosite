/*
  # Create gallery images table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `url` (text, image URL)
      - `filename` (text, original filename)
      - `sort_order` (integer, for ordering)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access
    - Add policy for authenticated users to manage images
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  filename text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_sort_order 
  ON gallery_images(sort_order, created_at);

CREATE INDEX IF NOT EXISTS idx_gallery_images_active 
  ON gallery_images(is_active);