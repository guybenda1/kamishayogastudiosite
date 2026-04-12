/*
  # הוסף אינטגרציה עם Shopify

  1. שינויים
    - הוספת שדה `shopify_product_id` לטבלת `products` - מזהה המוצר ב-Shopify
    - הוספת שדה `shopify_variant_id` לטבלת `product_variants` - מזהה הווריאנט ב-Shopify
    
  2. הערות
    - השדות הללו מאפשרים קישור ישיר בין המוצרים שלנו למוצרים ב-Shopify
    - זה יאפשר הוספה נכונה לסל הקניות של Shopify
*/

-- הוספת שדה shopify_product_id לטבלת products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'shopify_product_id'
  ) THEN
    ALTER TABLE products ADD COLUMN shopify_product_id text;
  END IF;
END $$;

-- הוספת שדה shopify_variant_id לטבלת product_variants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_variants' AND column_name = 'shopify_variant_id'
  ) THEN
    ALTER TABLE product_variants ADD COLUMN shopify_variant_id text;
  END IF;
END $$;