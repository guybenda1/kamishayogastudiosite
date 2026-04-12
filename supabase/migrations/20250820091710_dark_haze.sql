/*
  # Create product variant images table

  1. New Tables
    - `product_variant_images`
      - `id` (uuid, primary key)
      - `variant_id` (uuid, foreign key to product_variants)
      - `image_url` (text, image URL)
      - `sort_order` (integer, for ordering images)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `product_variant_images` table
    - Add policies for authenticated users to manage images
    - Add policy for public to read active images

  3. Indexes
    - Index on variant_id for fast lookups
    - Index on sort_order for ordering
    - Index on is_active for filtering
*/

-- Create product_variant_images table
CREATE TABLE IF NOT EXISTS product_variant_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_variant_images_variant_id_fkey'
  ) THEN
    ALTER TABLE product_variant_images 
    ADD CONSTRAINT product_variant_images_variant_id_fkey 
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_variant_images_variant_id 
ON product_variant_images(variant_id);

CREATE INDEX IF NOT EXISTS idx_product_variant_images_sort_order 
ON product_variant_images(sort_order);

CREATE INDEX IF NOT EXISTS idx_product_variant_images_active 
ON product_variant_images(is_active);

-- Enable RLS
ALTER TABLE product_variant_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage variant images"
  ON product_variant_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active variant images"
  ON product_variant_images
  FOR SELECT
  TO public
  USING (is_active = true);