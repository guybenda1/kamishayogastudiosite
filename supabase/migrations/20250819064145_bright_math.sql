/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required) - שם המתרגל
      - `text` (text, required) - טקסט הביקורת
      - `rating` (integer, required) - דירוג 1-5
      - `image` (text, required) - קישור לתמונה
      - `is_active` (boolean, default true) - האם הביקורת פעילה
      - `sort_order` (integer, default 0) - סדר הצגה
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for authenticated users to manage testimonials
    - Add policy for public to read active testimonials
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image text NOT NULL DEFAULT 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage all testimonials
CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for public to read active testimonials
CREATE POLICY "Public can read active testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_active_sort ON testimonials (is_active, sort_order, created_at);

-- Insert default testimonials
INSERT INTO testimonials (name, text, rating, image, is_active, sort_order) VALUES
('גודי א.', 'מקצועיות ברמה אחרת!!!!! אושר עילאי כשנכנסים לסטודיו אווירה רגועה הנאה שחרור ...סוג הספורט היחיד שאני מוכנה לתרגל רק בגלל סטודיו קמישה והמורה המדהימה שאין כמותה ולא תהיה !!!', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 1),
('גליה ע.', 'לימורי אישה מאוד מיוחדת, העברת היוגה בדרך טובה ונעימה, מקצועית, לצאת מהיוגה של לימור זה להתחדש במלוא האנרגיה הדרושה. פשוט כיף להגיע, לחוות ולהתמלא מחדש! תודה את אישה מהממת! ואין על שיעורי היוגה שלך', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 2),
('מוריה פ.', 'מדריכה מדהימה. אימון מקצועי לגוף ולנפש', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 3),
('מירב ח.', 'לימוד מהממת, נותנת יחס אישי. החוויה בכל שיעור עוצמתית.', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 4),
('רינת ע.', 'לימורי מיוחדת! הכי מקצועית בתחום! סטודיו מושלם, אווירה מדהימה! הכי מומלצת!', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 5),
('שירן א.', 'וואו, סטודיו שמשלב תרגול יוגה לצד תחושת רגיעה וסיפוק אינסופי! לימור המהממת דואגת לכל פרט ופרט ולא מחסירה מהמתרגלות כלום! מחכה כל פעם מחדש לקראת התרגול. מומלץ בחום!!!!', 5, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', true, 6);