/*
  # Create product variants table

  1. New Tables
    - `product_variants`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `name` (text, variant name)
      - `description` (text, variant description)
      - `price` (numeric, variant price)
      - `image_url` (text, variant image)
      - `stock_quantity` (integer, variant stock)
      - `is_active` (boolean, variant status)
      - `sort_order` (integer, display order)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `product_variants` table
    - Add policies for authenticated users to manage variants
    - Add policies for public users to read active variants

  3. Sample Data
    - Create sample variants for existing products
*/

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_sort_order ON product_variants(sort_order);

-- RLS Policies for product_variants
CREATE POLICY "Public can read active product variants"
  ON product_variants
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all product variants"
  ON product_variants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert product variants"
  ON product_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product variants"
  ON product_variants
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete product variants"
  ON product_variants
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample variants for existing products
DO $$
DECLARE
  product_record RECORD;
BEGIN
  -- Loop through existing products and create variants
  FOR product_record IN SELECT id, name, price, image_url FROM products WHERE is_active = true
  LOOP
    -- Insert 3 variants for each product
    INSERT INTO product_variants (product_id, name, description, price, image_url, stock_quantity, sort_order) VALUES
    (
      product_record.id,
      'דגם בסיסי - מתאים למתחילים',
      'הדגם הבסיסי והאמין ביותר, מושלם למתחילים',
      product_record.price,
      product_record.image_url,
      15,
      1
    ),
    (
      product_record.id,
      'דגם מתקדם - גרסה מתקדמת',
      'דגם משופר עם תכונות נוספות למתרגלים מנוסים',
      product_record.price * 1.3,
      'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      10,
      2
    ),
    (
      product_record.id,
      'דגם פרימיום - עיצוב חדשני',
      'הדגם המתקדם ביותר עם עיצוב ייחודי ותכונות פרימיום',
      product_record.price * 1.6,
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      5,
      3
    );
  END LOOP;
END $$;