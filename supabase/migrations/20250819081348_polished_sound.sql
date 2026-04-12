/*
  # Create site images table for persistent image storage

  1. New Tables
    - `site_images`
      - `id` (uuid, primary key)
      - `section` (text) - which section of the site (hero, about, studio, contact, etc.)
      - `image_url` (text) - the URL of the image
      - `alt_text` (text) - alternative text for accessibility
      - `is_active` (boolean) - whether the image is currently active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `site_images` table
    - Add policy for public to read active images
    - Add policy for authenticated users to manage all images

  3. Indexes
    - Index on section for fast lookups
    - Index on is_active for filtering
*/

CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read active site images"
  ON site_images
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage site images"
  ON site_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_images_section ON site_images (section);
CREATE INDEX IF NOT EXISTS idx_site_images_active ON site_images (is_active);
CREATE INDEX IF NOT EXISTS idx_site_images_section_active ON site_images (section, is_active);

-- Insert default images
INSERT INTO site_images (section, image_url, alt_text, is_active) VALUES
  ('about', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'לימור - מורה יוגה אשטנגה-ויניאסה', true),
  ('studio', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'סטודיו ליוגה קמישה - מרחב אינטימי ומעורר השראה', true),
  ('contact', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'יצירת קשר - סטודיו יוגה קמישה', true),
  ('classes-0', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'תרגולים קבוצתיים', true),
  ('classes-1', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'תרגולים אישיים', true),
  ('classes-2', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'ליווי גוף נפש', true),
  ('classes-3', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'מפגשי העמקה וסדנאות', true),
  ('retreats-0', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'ריטריט יוגה בטבע', true),
  ('retreats-1', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'מדיטציה בקבוצה', true),
  ('retreats-2', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'תרגול יוגה בחוץ', true)
ON CONFLICT DO NOTHING;